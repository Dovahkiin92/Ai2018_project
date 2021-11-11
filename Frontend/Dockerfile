# Stage 1
FROM node:10-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g @angular/cli@11.0.2
COPY . /app
RUN ng build --output-path=dist --prod=true
# Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build-step /app/dist /usr/share/nginx/html
COPY ng.conf /etc/nginx/conf.d/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
# expose port 80
EXPOSE 80
# run nginx
CMD ["nginx", "-g", "daemon off;"]

