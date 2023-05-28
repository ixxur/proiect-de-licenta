# Use the official Node.js runtime as a base image
FROM node:14 as build

# Set the working directory in the container to /app
WORKDIR /app

# Add REACT_APP_API_URL as a build argument
ARG REACT_APP_API_URL

# Set REACT_APP_API_URL as an environment variable
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Bundle the application source inside the container
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve app with Nginx 
FROM nginx:1.19.0-alpine 

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html 

# The build context should include default.conf file.
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 to the outside
EXPOSE 3000 

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]