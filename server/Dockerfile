# Use official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Bundle the application source inside the container
COPY . .

# Copy the .env file into our app directory
# COPY .env ./

# Expose port 8080 to the outside
EXPOSE 8080

# Define the command to run the application
CMD [ "node", "server.js" ]