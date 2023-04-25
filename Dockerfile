# Parent image: UBI9 with Node.js v16
FROM registry.access.redhat.com/ubi9/nodejs-16@sha256:1c015c86115262f366290f91a2387b64ce0695041db0dd3226b478836088e916

USER root
RUN yum update -y && yum upgrade -y

ENV APP_ROOT=/app
WORKDIR ${APP_ROOT}

# Copy all code (except what's on .dockerignore)
COPY . .

# Install dependencies
# (requires internet access to the npm public registry at https://registry.npmjs.org/)
RUN npm ci

# Build production code from source
RUN npm run build

RUN chown -R 1001:0 ${APP_ROOT} && chmod -R u+rwx ${APP_ROOT} && \
    chmod -R g=u ${APP_ROOT}

USER 1001

EXPOSE 3000

# Runs node on the production code at build/index.js
CMD ["node", "build"]