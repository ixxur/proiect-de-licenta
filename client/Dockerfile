# Use the official Node.js runtime as a base image
FROM node:14 as build

# Set the working directory in the container to /app
WORKDIR /app

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

# Copy the env-config template
COPY ./public/env-config.js /usr/share/nginx/html

# Expose port 3000 to the outside
EXPOSE 3000 

# Replace environment variables in env-config.js and start Nginx server
CMD /bin/sh -c "envsubst < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js && exec nginx -g 'daemon off;'"