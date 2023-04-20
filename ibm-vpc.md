# IBM Virtual Private Cloud tutorial notes / cheatsheet

## Introduction

This document contains notes taken during the execution of the IBM Cloud tutorial [Public frontend and private backend in a Virtual Private Cloud](https://cloud.ibm.com/docs/solution-tutorials?topic=solution-tutorials-vpc-public-app-private-backend).

The tutorial guides the reader through the creation of a VPC in IBM Cloud and then a front end and back end VSIs (Virtual
Server Instances). After going through the tutorial, the guestbook project is deployed in the front end VSI and a MongoDB
server is deployed in the back end VSI. The final result is a fully running NodeJS + MongoDB application.

## Tutorial notes

These are several things to be aware of while going through the tutorial:

- When creating a pair of front-back subnets, it makes sense to do it in the same zone (for example, Frankfurt 1), because they are not subnets with redundancy VSIs, but to isolate the backend from the frontend.
- When naming the components indicated by the tutorial, it is better to prefix the names with your initials, otherwise, everyone will create them with the same name.
- After creating a _resource group_, you need to wait about 5 minutes until it appears in the list of resource groups on the VPC signup page.
- To create the SSH Key (if you don't have one), you need to run `ssh-keygen -t rsa` on Mac, Linux, or Git Bash. Then, the content of the public key will be in `~/.ssh/id_rsa.pub`.
- After creating the bastion and the floating IP, you can enter with `ssh root@149.81.9.159` (the floating IP obtained when creating the bastion).
- When creating the `vpc-secure-maintenance-sg` security group, make sure that in the previous step, the corresponding VPC has been selected. If not, our bastion will not appear when creating the inbound rule.
- In steps 2 and 3 (Create a backend/frontend security group and VSI), make sure to select our VPC.
- At the beginning of step 4, it proposes using a floating IP that is not created => we have to edit the VSI and add the floating IP.
- When adding new communication ports between the front and back VSI, add them to both the front outbound and back inbound, referencing the security group of the other VSI.
- The front is available at the floating IP of the frontend VSI.
- The public IP of the front is 149.81.239.188, and the URL is http://149.81.239.188/.

## Installing Node.js and MongoDB

### Node.js

- Enter the front VSI: `ssh -J root@149.81.9.159 root@10.243.128.4` (use your own IPs)
- `nvm` needs to be installed because `apt-get` installs `node` v12 and we need `node` v16+.
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`
  - `nvm install v16`
- Also install `npm`: `apt install npm`
- Create the directory `/app` and clone the repository: `git clone https://github.ibm.com/CoC-Assets/guest-book.git`
- From `/app/guest-book`, run `npm install` and then `npm run build`.
- Launch the server with `nohup npx vite preview --host --port 80 &`
  - The process will continue running after closing the ssh session
  - To kill the process, either find the `node` process with `ps -A | grep node` and kill it with `kill -9 [pid]`, or restart the VSI.
  - The server will need to be restarted if there are changes to the front-end code or back-end configuration.

## MongoDB

- Access the back-end VSI: `ssh -J root@149.81.9.159 root@10.243.64.4` (use your own IPs)
- All the following steps fail, they are left here only for reference:
  - Follow these instructions to install MongoDB: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
    - Step 2 fails. You need to manually download the key from https://pgp.mongodb.com/server-6.0.asc using your browser and then paste it into a local file with `vi`.
    - Then process the key with `cat svrkey.txt | gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor`.
    - **The installation fails, probably because the VSI does not support IPV6.**
  - Podman / Docker also don't work.
- MongoDB must be installed manually instead. Download and install the binary:
  - Local download: download from https://repo.mongodb.org/apt/ubuntu/dists/jammy/mongodb-org/6.0/multiverse/binary-amd64/mongodb-org-server_6.0.5_amd64.deb using your personal browser
  - Copy to the backend: `scp -J root@149.81.9.159 /Users/username/Downloads/mongodb-org-server_6.0.5_amd64.deb root@10.243.64.4:/root/inst`
  - Install on the backend: `dpkg -i mongodb-org-server_6.0.5_amd64.deb`
  - Create directories: `mkdir /var/lib/mongo` and `mkdir /var/log/mongodb`
- Run it:
  - Command: `mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --bind_ip_all --fork`
  - Verify that it is running: `lsof -i -P -n | grep LISTEN`. It should show something like:
    - `mongod    14020            root   15u  IPv4  59854      0t0  TCP *:27017 (LISTEN)`
  - It can be killed with `kill -9 [pid]`, where `pid` is the second element in the output of the `lsof` command, in this case, `14020`.
- Add port `27017` to the security groups of the front (outbound) and back (inbound).
  - In the security group **vpc-pubpriv-frontend-sg**, add an _outbound_ rule:
    - Protocol: **TCP**
    - Port range: **27017-27017**
    - Destination: **vpc-pubpriv-backend-sg**
  - In the security group **vpc-pubpriv-backend-sg**, add an _inbound_ rule:
    - Protocol: **TCP**
    - Port range: **27017-27017**
    - Destination: **vpc-pubpriv-frontend-sg**
