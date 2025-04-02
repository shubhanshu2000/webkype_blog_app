## Running MySQL with Docker

To set up and run a MySQL database using Docker, use the following command:

```sh
docker run --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=YOUR_DATABASE \
  -p 3306:3306 \
  -d mysql:latest
```
