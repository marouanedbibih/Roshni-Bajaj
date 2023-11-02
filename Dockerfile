FROM php:8.1.23-fpm-alpine3.18

RUN docker-php-ext-install pdo pdo_mysql 

RUN apk add libzip-dev

RUN docker-php-ext-install zip 

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer