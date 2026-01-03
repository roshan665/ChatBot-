# Step 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine
# Copy the build output to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Cloud Run expects traffic on port 8080 by default
EXPOSE 8080
# Configure Nginx to listen on 8080
RUN sed -i 's/listen  80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
