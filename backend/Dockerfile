# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create upload directory
RUN mkdir -p upload

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
