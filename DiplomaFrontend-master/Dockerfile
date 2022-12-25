FROM node:19-alpine3.15 AS build

WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build


#FROM httpd:2.4
#MAINTAINER  Author Name author@email.com
#COPY --from=build /usr/src/app/dist/frontend /usr/local/apache2/htdocs/
#COPY ./.htaccess /usr/local/apache2/htdocs/
#COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
#RUN chmod -R 755 /usr/local/apache2/htdocs/
#EXPOSE 4200

FROM nginx:latest

COPY --from=build /usr/local/app/dist/frontend /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
