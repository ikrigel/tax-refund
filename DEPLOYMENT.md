# הנחיות פריסה - מערכת חילוץ טופס 106

מדריך מלא לפריסת המערכה בסביבת ייצור.

## 📋 תוכן העניינים

- [דרישות מערכת](#דרישות-מערכת)
- [הגדרת n8n Server](#הגדרת-n8n-server)
- [הגדרת Google Gemini API](#הגדרת-google-gemini-api)
- [פריסת React Frontend](#פריסת-react-frontend)
- [חיבור Backend ו-Frontend](#חיבור-backend-ו-frontend)
- [אבטחה](#אבטחה)
- [ניטור וליווח](#ניטור-וליווח)
- [גיבוי והחזקה](#גיבוי-והחזקה)
- [רשימת בדיקה של פריסה](#רשימת-בדיקה-של-פריסה)

## 🖥️ דרישות מערכת

### n8n Server
- **OS**: Linux (Ubuntu 20.04+), Windows Server, macOS
- **Node.js**: 18.10.0 ומעלה
- **RAM**: 2GB מינימום, 4GB+ לייצור
- **Disk**: 10GB+ עבור ניתוח מסדי נתונים וניטור
- **Database**: PostgreSQL (מומלץ) או SQLite (פיתוח בלבד)

### React Frontend
- **Node.js**: 16+
- **npm**: 7+ או yarn 3+
- **Disk**: 500MB עבור build output

### Infrastructure
- **דומיין**: שם דומיין תקף עם SSL certificate
- **Firewall**: פתח ports 443 (HTTPS), 5678 (n8n אם פנים), 3000 (frontend)
- **Load Balancer**: אופציונלי עבור high availability

## 🚀 הגדרת n8n Server

### 1. התקנה בשרת ייצור

```bash
# העדכן את מערכת ההפעלה
sudo apt update && sudo apt upgrade -y

# התקן Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# התקן n8n globally
sudo npm install -n n8n -g

# יצור user עבור n8n
sudo useradd -m -s /bin/bash n8n

# בנה תיקיית עבודה
sudo mkdir -p /opt/n8n
sudo chown -R n8n:n8n /opt/n8n
```

### 2. הגדרת PostgreSQL (מומלץ)

```bash
# התקן PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# התחל את השירות
sudo systemctl start postgresql
sudo systemctl enable postgresql

# צור מסד נתונים וביוזר
sudo -u postgres psql << EOF
CREATE USER n8n_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE n8n_db OWNER n8n_user;
GRANT ALL PRIVILEGES ON DATABASE n8n_db TO n8n_user;
EOF
```

### 3. הגדרת n8n Service

צור קובץ systemd:

```bash
sudo nano /etc/systemd/system/n8n.service
```

תוכן הקובץ:
```ini
[Unit]
Description=n8n Workflow Automation
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=n8n
WorkingDirectory=/opt/n8n

# הגדרות Environment
Environment="DB_TYPE=postgresdb"
Environment="DB_POSTGRESDB_HOST=localhost"
Environment="DB_POSTGRESDB_PORT=5432"
Environment="DB_POSTGRESDB_DATABASE=n8n_db"
Environment="DB_POSTGRESDB_USER=n8n_user"
Environment="DB_POSTGRESDB_PASSWORD=your_secure_password"
Environment="WEBHOOK_URL=https://your-domain.com/webhook"
Environment="GENERIC_TIMEZONE=Asia/Jerusalem"
Environment="NODE_ENV=production"

ExecStart=/usr/bin/n8n start

Restart=always
RestartSec=10

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

הפعל את השירות:
```bash
sudo systemctl daemon-reload
sudo systemctl start n8n
sudo systemctl enable n8n
```

### 4. Reverse Proxy עם Nginx

```bash
sudo apt install -y nginx

# יצור קובץ config
sudo nano /etc/nginx/sites-available/n8n
```

תוכן:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

הפעל Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔑 הגדרת Google Gemini API

### 1. צור Google Cloud Project

1. עבור ל-[Google Cloud Console](https://console.cloud.google.com)
2. לחץ `Create Project`
3. קרא לפרויקט: `tax-refund-extraction`
4. המתן ל-Project ליצור

### 2. הפעל את Generative Language API

1. חפש `Generative Language API`
2. לחץ `Enable`
3. המתן להפעלה

### 3. צור API Key

1. עבור לקטע `Credentials`
2. לחץ `Create Credentials` → `API Key`
3. העתק את ה-API Key
4. לחץ `Restrict Key`
5. בחר `Generative Language API`
6. שמור את המפתח בתוך n8n

### 4. בתוך n8n

1. עבור ל-`Credentials`
2. לחץ `Create`
3. בחר `Google PaLM API`
4. הדבק את API Key
5. שמור

## 🌐 פריסת React Frontend

### Option 1: Static Hosting (Vercel/Netlify)

```bash
cd frontend

# בנה את ייצור
npm run build

# ייצוא בquite
# Vercel
npm install -g vercel
vercel

# או Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 2: Docker Container

צור `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/vite.config.js ./

ENV REACT_APP_WEBHOOK_URL=https://your-domain.com/webhook/tax-refund
ENV NODE_ENV=production

RUN npm run build

FROM node:18-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=0 /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

בנה והרץ:
```bash
docker build -t tax-refund-frontend .
docker run -p 3000:3000 tax-refund-frontend
```

### Option 3: Traditional Server

```bash
# התקן
cd /var/www/tax-refund
npm install
npm run build

# שרת Nginx
server {
    listen 80;
    server_name app-domain.com;
    root /var/www/tax-refund/dist;

    location / {
        try_files $uri /index.html;
    }
}
```

## 🔗 חיבור Backend ו-Frontend

### הגדרת Environment Variables

**n8n (.env)**:
```
WEBHOOK_URL=https://your-domain.com/webhook
CORS_ORIGIN=https://app-domain.com
NODE_ENV=production
```

**Frontend (.env.production)**:
```
REACT_APP_WEBHOOK_URL=https://your-domain.com/webhook/tax-refund
```

### בדיקת חיבור

```bash
# בדוק אם webhook זמין
curl -X POST \
  -F "file=@test.pdf" \
  https://your-domain.com/webhook/tax-refund

# בדוק CORS
curl -H "Origin: https://app-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  https://your-domain.com/webhook/tax-refund
```

## 🔐 אבטחה

### 1. HTTPS/SSL
```bash
# בעזרת Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 2. Webhook Authentication

הוסף API Key בדיקה:
```javascript
// n8n: בתוך הworkflow, הוסף קוד בdictionary לבדיקה:
if ($json.headers['X-API-Key'] !== process.env.WEBHOOK_API_KEY) {
  return { status: 'error', message: 'Unauthorized' };
}
```

Frontend:
```javascript
const response = await fetch(webhookUrl, {
  method: 'POST',
  body: formData,
  headers: {
    'X-API-Key': process.env.REACT_APP_API_KEY,
  },
});
```

### 3. Rate Limiting

```nginx
# Nginx - הגבל requests
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /webhook {
    limit_req zone=api_limit burst=20;
    # ...
}
```

### 4. Input Validation

בדוק גודל קובץ:
```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large');
}
```

## 📊 ניטור וליווח

### Logging

**n8n logs**:
```bash
journalctl -u n8n -f  # Real-time logs
tail -f /var/log/n8n/debug.log
```

**Frontend errors**:
```javascript
// בתוך App.jsx
window.addEventListener('error', (event) => {
  console.error('Frontend error:', event.error);
  // שלח ל-monitoring service
});
```

### Health Checks

```bash
# בדוק n8n health
curl http://localhost:5678/api/v1/health

# בדוק webhook
curl -X POST \
  -F "file=@test.pdf" \
  -I http://localhost:5678/webhook/tax-refund
```

### Monitoring Services

מוסיף Prometheus/Grafana:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'n8n'
    static_configs:
      - targets: ['localhost:5678']
```

## 💾 גיבוי והחזקה

### גיבוי מסד הנתונים

```bash
# יומי
0 2 * * * pg_dump -U n8n_user n8n_db > /backup/n8n_$(date +\%Y\%m\%d).sql

# Upload לStorage
0 3 * * * aws s3 cp /backup/n8n_$(date +\%Y\%m\%d).sql s3://your-backup-bucket/
```

### גיבוי Workflows

```bash
# Export all workflows
n8n export:workflow --all > /backup/workflows.json

# Scheduled backup
0 4 * * * n8n export:workflow --all > /backup/workflows_$(date +\%Y\%m\%d).json
```

### Recovery Procedure

```bash
# שחזר מסד נתונים
psql -U n8n_user n8n_db < /backup/n8n_20240201.sql

# שחזר workflows
n8n import:workflow < /backup/workflows.json
```

## ✅ רשימת בדיקה של פריסה

- [ ] Node.js 18+ מותקן
- [ ] PostgreSQL מופעל
- [ ] n8n service רץ
- [ ] Google Gemini API credentials מוגדרים
- [ ] Nginx/Reverse Proxy מוגדר
- [ ] SSL certificate בתוקף
- [ ] Frontend build מוגדר
- [ ] CORS properly configured
- [ ] Webhook endpoint תגיע
- [ ] API Key authentication מוגדר
- [ ] Logging מוגדר
- [ ] Health checks working
- [ ] Backup schedule מוגדר
- [ ] Firewall rules בעבודה
- [ ] Performance monitoring כולל
- [ ] Database connectivity verified
- [ ] Frontend served properly
- [ ] End-to-end testing passed

## 🆘 Troubleshooting

### n8n won't start
```bash
# בדוק logs
journalctl -u n8n -n 50
tail -f /var/log/syslog | grep n8n

# בדוק permission issues
sudo chown -R n8n:n8n /opt/n8n
```

### Webhook not responding
```bash
# בדוק אם port חוסם
netstat -tulpn | grep 5678

# בדוק Nginx config
sudo nginx -t
```

### Google API errors
```bash
# בדוק API Key תקף
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY"

# בדוק if API enabled
# בדוק ב-Google Cloud Console
```

## 📞 Support

לשאלות:
1. בדוק logs
2. בדוק [README.md](README.md)
3. בדוק [claude.md](claude.md)
