# Use official nginx image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config (if using Angular routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY dist/powfit-angular /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
