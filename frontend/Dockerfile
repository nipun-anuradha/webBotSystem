# Stage 1: Build the Vite app
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Vite app files into the container
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the Vite app
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the built Vite app from the first stage
COPY --from=builder /app/dist .

# Install serve package to serve static files
RUN npm install serve

# Expose the port that the app will listen on
EXPOSE 3000

# Command to serve the app
CMD ["npx", "serve", "."]
