# Use a Windows-compatible Node.js base image
FROM mcr.microsoft.com/windows/servercore:ltsc2022 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the web server
CMD ["npm", "run", "dev"]