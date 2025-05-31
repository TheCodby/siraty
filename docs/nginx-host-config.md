# 🌐 Host Nginx Configuration for Siraty

Since you're managing Nginx directly on your VPS, here are configuration examples for your host nginx.

## 📋 Prerequisites

1. Install nginx on your VPS:

   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install nginx

   # CentOS/RHEL
   sudo yum install nginx
   ```

2. Install Certbot for SSL:

   ```bash
   # Ubuntu/Debian
   sudo apt install certbot python3-certbot-nginx

   # CentOS/RHEL
   sudo yum install certbot python3-certbot-nginx
   ```

## 🔧 Basic Configuration

Create `/etc/nginx/sites-available/siraty.com`:

```nginx
server {
    listen 80;
    server_name siraty.com www.siraty.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name siraty.com www.siraty.com;

    # SSL Configuration (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/siraty.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siraty.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Static Files Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Routes (stricter rate limiting)
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Main Application
    location / {
        limit_req zone=general burst=50 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health Check
    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:3000/api/health;
        proxy_set_header Host $host;
    }

    # Security: Block sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ /(package\.json|package-lock\.json|\.env.*|docker-compose.*|Dockerfile.*) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

## 🚀 Setup Commands

1. **Enable the site:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/siraty.com /etc/nginx/sites-enabled/
   ```

2. **Test configuration:**

   ```bash
   sudo nginx -t
   ```

3. **Get SSL certificate:**

   ```bash
   sudo certbot --nginx -d siraty.com -d www.siraty.com
   ```

4. **Start nginx:**

   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

5. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## 🔄 Auto-renewal

Setup automatic SSL renewal:

```bash
sudo crontab -e
```

Add this line:

```
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring

Check nginx status:

```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Production Checklist

- [ ] Domain DNS points to your VPS IP
- [ ] Firewall allows ports 80 and 443
- [ ] Docker app running on localhost:3000
- [ ] SSL certificate obtained and configured
- [ ] Nginx configuration tested and active
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Gzip compression enabled
- [ ] Auto-renewal configured

## 🎯 Benefits of This Setup

- **Multiple Apps**: Can serve other projects on same VPS
- **SSL Management**: Easy Let's Encrypt integration
- **Performance**: Direct network access
- **Monitoring**: System logs and monitoring tools
- **Flexibility**: Full control over nginx configuration
