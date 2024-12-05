# # Build stage
# FROM node:20-alpine AS build

# WORKDIR /app

# # Install dependencies first (better layer caching)
# COPY package.json package-lock.json ./
# RUN npm ci

# # Copy source files
# COPY . .

# # Install Vite globally
# RUN npm install -g vite

# # Build the app
# RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy pre-built files
COPY build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]