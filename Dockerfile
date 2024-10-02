ARG NODE_VERSION=20.11.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to install dependencies.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Generate Prisma client
RUN npx prisma generate

################################################################################

# Set environment variables
ENV NODE_ENV=development
ENV TZ=Asia/Ho_Chi_Minh

# Use a non-root user for security.
USER node

# Expose the port that the application listens on.
EXPOSE 4080

# Run the application using ts-node-dev with environment variables.
CMD ["npx", "cross-env", "NODE_ENV=development", "TZ=Asia/Ho_Chi_Minh", "ts-node-dev", "--respawn", "App.ts"]
