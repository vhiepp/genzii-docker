# Mạng xã hội Genzii

## Clone dự án
```terminal

git clone https://github.com/vhiepp/genzii-docker

cd genzii-docker

```

## Build dự án
```terminal

docker compose build

```

## Chạy dự án
```terminal

docker compose up -d

```

## Tạo cơ sở dữ liệu
```terminal

docker exec -it genzii-backend php artisan migrate

```
