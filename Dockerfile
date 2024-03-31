# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.2.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Install Python, build tools, and MySQL client
RUN apk --no-cache add \
    python3 \
    make \
    g++ \
    mysql-client

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Wait for MySQL to be ready
CMD ["sh", "-c", "until mysqladmin ping -h192.168.56.1 -uroot -pDaniel; do echo 'Waiting for MySQL...'; sleep 1; done; echo 'MySQL is ready!'; npm start"]
