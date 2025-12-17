# ---------- STEP 1: Build the React app ----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Accept build-time variable
ARG GEMINI_API_KEY

# Write it into .env.local for Vite
RUN echo "VITE_GEMINI_API_KEY=${GEMINI_API_KEY}" > .env.local

# Build the app
RUN npm run build


# ---------- STEP 2: Serve using Nginx ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Cloud Run port
EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
