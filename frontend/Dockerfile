# Use the official Node.js image to build the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start the development server and bind to all network interfaces
# (Note: For production, you'd typically run 'npm run build' and serve with Nginx, 
# but for a hackathon demo, running the dev server is often acceptable and easier)
CMD ["npm", "run", "dev", "--", "--host"]