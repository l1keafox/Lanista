# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app
# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "start"]