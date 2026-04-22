### گام 1: Build و اجرا با یک دستور

```bash
docker compose up --build
```

### گام 2: اجرا در Background (پس‌زمینه)

```bash
docker compose up -d --build
```

### گام 3: مشاهده لاگ‌ها

```bash
docker compose logs -f
```

### دستورات مدیریتی:

```bash
# متوقف کردن
docker compose down

# Restart کردن
docker-compose restart

# مشاهده وضعیت
docker-compose ps

# پاک کردن کامل
docker-compose down -v
docker rmi promptyab-promptyab
```
