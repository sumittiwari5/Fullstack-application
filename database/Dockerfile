FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootroot
ENV MYSQL_DATABASE=ClickNcart

# Copy your MySQL config (even if empty now, it's the right place for tuning later)
COPY my.cnf /etc/mysql/conf.d/my.cnf

# MySQL's official image auto-runs any .sql file placed here on first boot
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 3306
