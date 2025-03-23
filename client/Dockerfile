# Stage 1: Build Vue app
FROM node:18 AS build

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy all files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
# CMD ["nginx", "-g", "daemon off;"]