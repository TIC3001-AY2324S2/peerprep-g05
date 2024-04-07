# This Dockerfile should be built with docker-compose to include the .env file.

# Use a base image
FROM node:18.18.2-alpine

ARG USER_SVC_PORT=3001
ENV USER_SVC_PORT=${USER_SVC_PORT}

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port your application is running on
EXPOSE $USER_SVC_PORT

# Start the application
CMD ["npm", "run", "dev"]