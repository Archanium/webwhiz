# Fetching the latest node image on apline linux
FROM node:14-slim AS builder

# Declaring env
ENV NODE_ENV production
# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

# Copying all the files in our project
COPY . .
COPY .env.docker .env

# Building our application
RUN npm run build

# Fetching the latest nginx image
FROM nginx:1-alpine
ENV WEB_HOST web

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]