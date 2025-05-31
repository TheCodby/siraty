# 🐳 Docker Setup for Siraty

This guide explains how to run the Siraty application using Docker with both development and production configurations.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Quick Start

### Development Environment

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd siraty
   chmod +x docker-scripts.sh
   ```

2. **Create environment file**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development environment**:

   ```bash
   ./docker-scripts.sh dev:start
   ```

4. **Access the application**:
   - Application: http://localhost:3000
   - pgAdmin: http://localhost:5050 (admin@siraty.com / admin)
   - Database: localhost:5432

### Production Environment

1. **Create production environment file**:

   ```bash
   cp .env.example .env.production
   # Configure with production values
   ```

2. **Start production environment**:
   ```bash
   ./docker-scripts.sh prod:start
   ```

## 🏗️ Architecture

### Development Stack

- **Next.js Application**: Hot reloading enabled
- **PostgreSQL 16**: Database with pgAdmin interface
- **Volume Mounts**: Source code mounted for live development

### Production Stack

- **Next.js Application**: Optimized standalone build
- **PostgreSQL 16**: Production database with resource limits
- **Nginx**: Reverse proxy with SSL, compression, and security headers
- **Backup Service**: Automated database backups

## 📝 Docker Commands

### Development Commands

```bash
# Start development environment
./docker-scripts.sh dev:start

# Stop development environment
./docker-scripts.sh dev:stop

# Restart development environment
./docker-scripts.sh dev:restart

# View logs
./docker-scripts.sh dev:logs [service]

# Open shell in container
./docker-scripts.sh dev:shell
```

### Production Commands

```bash
# Start production environment
./docker-scripts.sh prod:start

# Stop production environment
./docker-scripts.sh prod:stop

# View production logs
./docker-scripts.sh prod:logs [service]
```

### Database Commands

```bash
# Run migrations
./docker-scripts.sh db:migrate

# Seed database
./docker-scripts.sh db:seed

# Reset database (⚠️ destructive)
./docker-scripts.sh db:reset

# Backup database (production)
./docker-scripts.sh db:backup
```

### Build Commands

```bash
# Build development image
./docker-scripts.sh build:dev

# Build production image
./docker-scripts.sh build:prod
```

### Utility Commands

```bash
# Check status
./docker-scripts.sh status

# Clean up resources
./docker-scripts.sh cleanup

# Show help
./docker-scripts.sh help
```

## ⚙️ Configuration

### Environment Variables

#### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
POSTGRES_USER="siraty_user"
POSTGRES_PASSWORD="secure_password"
POSTGRES_DB="siraty_db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI
OPENAI_API_KEY="your-openai-key"
```

#### Production Additional Variables

```bash
# Domain and SSL
NEXT_PUBLIC_APP_URL="https://siraty.com"
NEXTAUTH_URL="https://siraty.com"

# Strong passwords
POSTGRES_PASSWORD="super_secure_production_password"
NEXTAUTH_SECRET="super_secure_nextauth_secret"
```

### Docker Compose Configurations

#### Development (`docker-compose.yml`)

- **Hot Reloading**: Source code mounted as volumes
- **Development Tools**: pgAdmin included
- **Debug Friendly**: All ports exposed
- **Fast Startup**: Minimal security restrictions

#### Production (`docker-compose.prod.yml`)

- **Optimized Build**: Multi-stage Dockerfile with standalone output
- **Security**: Internal networks, resource limits
- **Performance**: Nginx reverse proxy with caching
- **Monitoring**: Health checks for all services
- **Backup**: Automated database backup service

## 🔐 Security Features

### Production Security

- **Network Isolation**: Internal networks for database
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Container monitoring
- **Security Headers**: HSTS, CSP, XSS protection
- **Rate Limiting**: API endpoint protection
- **SSL/TLS**: HTTPS enforcement

### Development Security

- **Default Credentials**: Easy setup with secure defaults
- **Local Only**: Services bound to localhost
- **Development Secrets**: Non-production keys

## 🔧 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Check if ports are available
netstat -tulpn | grep :3000

# Rebuild image
./docker-scripts.sh build:dev
```

#### Database Connection Issues

```bash
# Check database status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Reset database
./docker-scripts.sh db:reset
```

#### Permission Issues (Linux/macOS)

```bash
# Fix script permissions
chmod +x docker-scripts.sh

# Fix volume permissions
sudo chown -R $USER:$USER .
```

### Performance Tuning

#### Development

- Increase Docker Desktop memory allocation (4GB+)
- Use volume mounts for faster file sync
- Disable unnecessary services in compose file

#### Production

- Adjust resource limits based on server capacity
- Configure nginx caching headers
- Optimize database connection pooling

## 📊 Monitoring

### Health Checks

- **Application**: `/api/health`
- **Database**: PostgreSQL health check
- **Nginx**: Configuration validation

### Logs

```bash
# Application logs
./docker-scripts.sh dev:logs app

# Database logs
./docker-scripts.sh dev:logs postgres

# All services
./docker-scripts.sh dev:logs
```

### Backup Strategy

- **Automated**: Daily backups in production
- **Retention**: 30 days by default
- **Compression**: Gzipped SQL dumps
- **Location**: `./backups/` directory

## 🚀 Deployment

### Local Development

1. Clone repository
2. Setup environment variables
3. Run `./docker-scripts.sh dev:start`

### Production Server

1. Setup server with Docker and Docker Compose
2. Clone repository to server
3. Configure production environment variables
4. Setup SSL certificates in `./docker/ssl/`
5. Run `./docker-scripts.sh prod:start`

### CI/CD Integration

```yaml
# Example GitHub Actions
- name: Build and Deploy
  run: |
    ./docker-scripts.sh build:prod
    ./docker-scripts.sh prod:start
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review logs with `./docker-scripts.sh dev:logs`
3. Ensure all environment variables are set
4. Verify Docker and Docker Compose versions
