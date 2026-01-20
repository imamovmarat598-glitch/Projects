# 🚀 Руководство по деплою

Инструкции по развертыванию бота в продакшен на различных платформах.

---

## 📋 Чек-лист перед деплоем

- [ ] Бот протестирован локально
- [ ] Все переменные окружения настроены
- [ ] База данных создана и миграции выполнены
- [ ] API ключи получены (KudaGo, Yandex Maps, Payment)
- [ ] Код закоммичен в Git

---

## 1️⃣ Heroku (самый простой)

### Преимущества
- ✅ Бесплатный тариф (с ограничениями)
- ✅ Автоматический деплой из Git
- ✅ Встроенная PostgreSQL база
- ✅ SSL/HTTPS из коробки

### Установка

1. **Создайте аккаунт на Heroku**
   - Зарегистрируйтесь: https://heroku.com

2. **Установите Heroku CLI**
   ```bash
   # Windows (скачать установщик)
   https://devcenter.heroku.com/articles/heroku-cli

   # Mac
   brew tap heroku/brew && brew install heroku

   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **Войдите в Heroku**
   ```bash
   heroku login
   ```

4. **Создайте приложение**
   ```bash
   cd city-travel-bot
   heroku create city-travel-bot-unique-name
   ```

5. **Добавьте PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

6. **Установите переменные окружения**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set YANDEX_MAPS_API_KEY=your_key
   heroku config:set PAYMENT_PROVIDER_TOKEN=your_token
   heroku config:set NODE_ENV=production
   ```

7. **Создайте Procfile**
   ```bash
   echo "worker: npm start" > Procfile
   ```

8. **Деплой**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

9. **Запустите воркер**
   ```bash
   heroku ps:scale worker=1
   ```

10. **Выполните миграции**
    ```bash
    heroku run npm run db:migrate
    ```

11. **Проверьте логи**
    ```bash
    heroku logs --tail
    ```

---

## 2️⃣ VPS (Digital Ocean, AWS, Yandex Cloud)

### Преимущества
- ✅ Полный контроль
- ✅ Больше производительности
- ✅ Дешевле при масштабировании

### Требования
- Ubuntu 20.04+ / Debian 11+
- 1GB RAM минимум
- SSH доступ

### Установка

**1. Подключитесь к серверу**
```bash
ssh root@your-server-ip
```

**2. Установите Node.js**
```bash
# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка
node --version
npm --version
```

**3. Установите PostgreSQL**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Создайте базу данных
sudo -u postgres psql
CREATE DATABASE city_travel_bot;
CREATE USER botuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE city_travel_bot TO botuser;
\q
```

**4. Установите Git**
```bash
sudo apt-get install git
```

**5. Клонируйте проект**
```bash
cd /opt
git clone https://github.com/your-username/city-travel-bot.git
cd city-travel-bot
```

**6. Настройте .env**
```bash
nano .env
```

Вставьте:
```env
TELEGRAM_BOT_TOKEN=your_token
DATABASE_URL=postgresql://botuser:secure_password@localhost:5432/city_travel_bot
YANDEX_MAPS_API_KEY=your_key
PAYMENT_PROVIDER_TOKEN=your_token
NODE_ENV=production
```

**7. Установите зависимости и соберите**
```bash
npm install
npm run build
```

**8. Выполните миграции**
```bash
npm run db:migrate
```

**9. Установите PM2 (менеджер процессов)**
```bash
sudo npm install -g pm2
```

**10. Запустите бота**
```bash
pm2 start dist/index.js --name city-travel-bot
pm2 save
pm2 startup
```

**11. Настройте автозапуск**
```bash
# PM2 выдаст команду, выполните её
# Например:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### Управление PM2

```bash
# Статус
pm2 status

# Логи
pm2 logs city-travel-bot

# Рестарт
pm2 restart city-travel-bot

# Остановка
pm2 stop city-travel-bot

# Удаление
pm2 delete city-travel-bot
```

### Обновление бота на VPS

```bash
cd /opt/city-travel-bot
git pull
npm install
npm run build
pm2 restart city-travel-bot
```

---

## 3️⃣ Docker (любая платформа)

### Создайте Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

### Создайте docker-compose.yml

```yaml
version: '3.8'

services:
  bot:
    build: .
    restart: unless-stopped
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - DATABASE_URL=postgresql://botuser:password@db:5432/city_travel_bot
      - YANDEX_MAPS_API_KEY=${YANDEX_MAPS_API_KEY}
      - PAYMENT_PROVIDER_TOKEN=${PAYMENT_PROVIDER_TOKEN}
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=botuser
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=city_travel_bot
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Запуск

```bash
docker-compose up -d
```

---

## 4️⃣ Railway (альтернатива Heroku)

1. Зарегистрируйтесь: https://railway.app
2. Подключите GitHub репозиторий
3. Добавьте PostgreSQL плагин
4. Установите переменные окружения
5. Деплой происходит автоматически при пуше в main

---

## 🔧 Настройка Webhook (опционально)

Webhook быстрее polling, но требует HTTPS.

**В коде замените:**

```typescript
// Вместо
bot.launch();

// Используйте
const domain = 'https://your-domain.com';
const webhookPath = '/webhook';

bot.telegram.setWebhook(`${domain}${webhookPath}`);

// Express сервер
import express from 'express';
const app = express();

app.use(bot.webhookCallback(webhookPath));
app.listen(process.env.PORT || 3000);
```

---

## 📊 Мониторинг

### PM2 мониторинг

```bash
pm2 install pm2-logrotate  # Ротация логов
pm2 monit                  # Реалтайм мониторинг
```

### Логирование

Добавьте Winston для продакшн логов:

```bash
npm install winston
```

---

## 🔐 Безопасность в продакшене

### Обязательно:

1. **Используйте переменные окружения**
   - Никогда не коммитьте `.env`
   - Используйте секреты платформы (Heroku Config Vars, Railway Variables)

2. **Обновляйте зависимости**
   ```bash
   npm audit fix
   npm update
   ```

3. **Настройте firewall на VPS**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

4. **Используйте SSL для webhook**
   - Let's Encrypt бесплатный SSL
   - Certbot для автоматической настройки

5. **Backup базы данных**
   ```bash
   # Автоматический backup каждый день
   0 2 * * * pg_dump city_travel_bot > /backup/db_$(date +\%Y\%m\%d).sql
   ```

---

## 🎯 Проверка после деплоя

- [ ] Бот отвечает на `/start`
- [ ] База данных подключена
- [ ] KudaGo API возвращает события
- [ ] Логи не показывают ошибок
- [ ] Бот работает 24/7 без падений

---

## ❓ Частые проблемы

**Бот не запускается**
→ Проверьте `heroku logs --tail` или `pm2 logs`

**Database connection error**
→ Убедитесь что `DATABASE_URL` правильный

**Out of memory**
→ Увеличьте размер dyno (Heroku) или RAM (VPS)

**Webhook не работает**
→ Убедитесь что домен имеет SSL сертификат

---

**Готово! Ваш бот в продакшене! 🚀**
