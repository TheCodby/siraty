#!/bin/bash

# Siraty Docker Management Script
# This script provides easy commands for managing the Siraty application with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Development commands
dev_start() {
    print_status "Starting development environment..."
    docker-compose up -d
    print_success "Development environment started!"
    print_status "Application: http://localhost:3000"
    print_status "pgAdmin: http://localhost:5050 (admin@siraty.com / admin)"
}

dev_stop() {
    print_status "Stopping development environment..."
    docker-compose down
    print_success "Development environment stopped!"
}

dev_restart() {
    print_status "Restarting development environment..."
    docker-compose restart
    print_success "Development environment restarted!"
}

dev_logs() {
    print_status "Showing development logs..."
    docker-compose logs -f ${1:-app}
}

dev_shell() {
    print_status "Opening shell in development container..."
    docker-compose exec app sh
}

# Production commands
prod_start() {
    print_status "Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Production environment started!"
}

prod_stop() {
    print_status "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped!"
}

prod_logs() {
    print_status "Showing production logs..."
    docker-compose -f docker-compose.prod.yml logs -f ${1:-app}
}

# Database commands
db_migrate() {
    print_status "Running database migrations..."
    docker-compose exec app npx prisma migrate deploy
    print_success "Database migrations completed!"
}

db_seed() {
    print_status "Seeding database..."
    docker-compose exec app npx prisma db seed
    print_success "Database seeded!"
}

db_reset() {
    print_warning "This will reset the database and all data will be lost!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        docker-compose exec app npx prisma migrate reset --force
        print_success "Database reset completed!"
    else
        print_status "Database reset cancelled."
    fi
}

db_backup() {
    print_status "Creating database backup..."
    docker-compose -f docker-compose.prod.yml run --rm backup
    print_success "Database backup completed!"
}

# Build commands
build_dev() {
    print_status "Building development image..."
    docker-compose build app
    print_success "Development image built!"
}

build_prod() {
    print_status "Building production image..."
    docker-compose -f docker-compose.prod.yml build app
    print_success "Production image built!"
}

# Cleanup commands
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    docker volume prune -f
    print_success "Docker cleanup completed!"
}

# Status commands
status() {
    print_status "Docker containers status:"
    docker-compose ps
    echo
    print_status "Docker images:"
    docker images | grep siraty || echo "No Siraty images found"
    echo
    print_status "Docker volumes:"
    docker volume ls | grep siraty || echo "No Siraty volumes found"
}

# Help function
show_help() {
    echo "Siraty Docker Management Script"
    echo "Usage: ./docker-scripts.sh [COMMAND]"
    echo
    echo "Development Commands:"
    echo "  dev:start     Start development environment"
    echo "  dev:stop      Stop development environment"
    echo "  dev:restart   Restart development environment"
    echo "  dev:logs      Show development logs [service]"
    echo "  dev:shell     Open shell in development container"
    echo
    echo "Production Commands:"
    echo "  prod:start    Start production environment"
    echo "  prod:stop     Stop production environment"
    echo "  prod:logs     Show production logs [service]"
    echo
    echo "Database Commands:"
    echo "  db:migrate    Run database migrations"
    echo "  db:seed       Seed database with initial data"
    echo "  db:reset      Reset database (WARNING: destructive)"
    echo "  db:backup     Create database backup (production)"
    echo
    echo "Build Commands:"
    echo "  build:dev     Build development image"
    echo "  build:prod    Build production image"
    echo
    echo "Utility Commands:"
    echo "  status        Show Docker resources status"
    echo "  cleanup       Clean up Docker resources"
    echo "  help          Show this help message"
}

# Main script logic
case "${1:-help}" in
    "dev:start")
        dev_start
        ;;
    "dev:stop")
        dev_stop
        ;;
    "dev:restart")
        dev_restart
        ;;
    "dev:logs")
        dev_logs $2
        ;;
    "dev:shell")
        dev_shell
        ;;
    "prod:start")
        prod_start
        ;;
    "prod:stop")
        prod_stop
        ;;
    "prod:logs")
        prod_logs $2
        ;;
    "db:migrate")
        db_migrate
        ;;
    "db:seed")
        db_seed
        ;;
    "db:reset")
        db_reset
        ;;
    "db:backup")
        db_backup
        ;;
    "build:dev")
        build_dev
        ;;
    "build:prod")
        build_prod
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac 