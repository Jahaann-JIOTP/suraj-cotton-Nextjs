# Use Node 18 as base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy full project
COPY . .

# Build the Next.js project
RUN npm run build

# Expose production port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
