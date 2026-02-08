# Use the official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your backend runs on
EXPOSE 5000

# Command to start the server
CMD ["node", "server.js"]