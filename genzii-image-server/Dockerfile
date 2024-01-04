FROM wyveo/nginx-php-fpm:php81

WORKDIR /var/www/html

COPY . .

COPY ./docker/nginx_log /var/log/nginx
COPY ./docker/php-fpm/php-fpm.log /var/log/php-fpm.log
COPY ./docker/config/app.conf /etc/nginx/conf.d/app.conf
