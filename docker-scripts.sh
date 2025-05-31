#!/bin/bash

# Siraty Docker Management Scripts
# This script helps manage the Docker containers for the Siraty application
# Now includes LibreOffice and Pandoc for document processing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Siraty Docker Management${NC}"
echo "============================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to verify document processing tools
verify_document_tools() {
    local environment=${1:-development}
    print_info "Verifying document processing tools in $environment container..."
    
    local compose_file=""
    local service_name="siraty"
    
    case $environment in
        "production"|"prod")
            compose_file="-f docker-compose.prod.yml"
            ;;
        "development"|"dev"|*)
            compose_file=""
            ;;
    esac
    
    # Check if container is running
    if ! docker-compose $compose_file ps | grep -q "$service_name.*Up"; then
        print_warning "Container not running. Starting it first..."
        docker-compose $compose_file up -d $service_name
        sleep 10
    fi
    
    echo "Checking LibreOffice..."
    docker-compose $compose_file exec $service_name libreoffice --version || print_error "LibreOffice not found"
    
    echo "Checking Pandoc..."
    docker-compose $compose_file exec $service_name pandoc --version || print_error "Pandoc not found"
    
    echo "Checking fonts..."
    docker-compose $compose_file exec $service_name fc-list | grep -i "dejavu\|noto\|liberation" | head -5
    
    print_status "Document processing tools verification complete"
}

# Main menu
show_menu() {
    echo ""
    echo "Available commands:"
    echo "1. build-dev      - Build development images"
    echo "2. build-prod     - Build production images"
    echo "3. start-dev      - Start development environment"
    echo "4. start-prod     - Start production environment"
    echo "5. stop-dev       - Stop development environment"
    echo "6. stop-prod      - Stop production environment"
    echo "7. logs-dev       - Show development logs"
    echo "8. logs-prod      - Show production logs"
    echo "9. verify-dev     - Verify tools in development"
    echo "10. verify-prod   - Verify tools in production"
    echo "11. shell-dev     - Access development shell"
    echo "12. shell-prod    - Access production shell"
    echo "13. clean         - Clean up Docker resources"
    echo "14. status        - Show containers status"
    echo "15. backup        - Run database backup"
    echo "0. exit           - Exit this script"
    echo ""
}

# Build functions
build_dev() {
    print_info "Building development environment with document processing tools..."
    check_docker
    docker-compose build siraty
    print_status "Development build completed"
}

build_prod() {
    print_info "Building production environment with document processing tools..."
    check_docker
    docker-compose -f docker-compose.prod.yml build siraty
    print_status "Production build completed"
}

# Start functions
start_dev() {
    print_info "Starting development environment..."
    check_docker
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local file not found"
        print_info "Creating a template .env.local file..."
        cat > .env.local << EOF
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production

# LinkedIn OAuth (optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key

EOF
        print_warning "Please update .env.local with your actual values"
    fi
    
    docker-compose up -d
    
    print_status "Development environment started successfully"
    print_info "🌐 Application: http://localhost:3000"
    print_info "📊 Database: PostgreSQL on localhost:5432"
    print_info "🗃️  pgAdmin: http://localhost:5050 (admin@siraty.com / admin)"
    print_info "📧 Mailhog: http://localhost:8025"
    print_info "📄 Document processing: LibreOffice + Pandoc enabled"
}

start_prod() {
    print_info "Starting production environment..."
    check_docker
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
        print_error ".env.production file not found"
        print_info "Please create .env.production with production values"
        return 1
    fi
    
    docker-compose -f docker-compose.prod.yml up -d
    
    print_status "Production environment started successfully"
    print_info "🌐 Application: http://localhost:3000"
    print_info "📊 Database: PostgreSQL (internal network)"
    print_info "📄 Document processing: LibreOffice + Pandoc enabled"
    print_warning "⚠️  Configure your reverse proxy to point to localhost:3000"
    print_warning "⚠️  Ensure proper SSL certificates are configured"
}

# Stop functions
stop_dev() {
    print_info "Stopping development environment..."
    docker-compose down
    print_status "Development environment stopped"
}

stop_prod() {
    print_info "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_status "Production environment stopped"
}

# Logs functions
logs_dev() {
    print_info "Showing development logs (press Ctrl+C to exit)..."
    docker-compose logs -f siraty
}

logs_prod() {
    print_info "Showing production logs (press Ctrl+C to exit)..."
    docker-compose -f docker-compose.prod.yml logs -f siraty
}

# Shell access functions
shell_dev() {
    print_info "Accessing development container shell..."
    print_info "Available tools: node, npm, libreoffice, pandoc, psql, git, vim"
    docker-compose exec siraty /bin/bash
}

shell_prod() {
    print_info "Accessing production container shell..."
    print_info "Available tools: node, npm, libreoffice, pandoc"
    docker-compose -f docker-compose.prod.yml exec siraty /bin/bash
}

# Backup function
backup_db() {
    print_info "Running database backup..."
    docker-compose -f docker-compose.prod.yml run --rm backup
    print_status "Database backup completed"
}

# Clean function
clean_docker() {
    print_warning "This will remove all stopped containers, unused networks, and dangling images"
    read -p "Are you sure? (y/n): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        docker system prune -f
        print_status "Docker cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Status function
show_status() {
    print_info "Development containers:"
    docker-compose ps
    
    echo ""
    print_info "Production containers:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_info "Docker system info:"
    docker system df
}

# Main script logic
if [ $# -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
        read -p "Choose an option: " choice
        
        case $choice in
            1) build_dev ;;
            2) build_prod ;;
            3) start_dev ;;
            4) start_prod ;;
            5) stop_dev ;;
            6) stop_prod ;;
            7) logs_dev ;;
            8) logs_prod ;;
            9) verify_document_tools "development" ;;
            10) verify_document_tools "production" ;;
            11) shell_dev ;;
            12) shell_prod ;;
            13) clean_docker ;;
            14) show_status ;;
            15) backup_db ;;
            0) print_status "Goodbye!"; exit 0 ;;
            *) print_error "Invalid option. Please try again." ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
else
    # Command line mode
    case $1 in
        build-dev) build_dev ;;
        build-prod) build_prod ;;
        start-dev) start_dev ;;
        start-prod) start_prod ;;
        stop-dev) stop_dev ;;
        stop-prod) stop_prod ;;
        logs-dev) logs_dev ;;
        logs-prod) logs_prod ;;
        verify-dev) verify_document_tools "development" ;;
        verify-prod) verify_document_tools "production" ;;
        shell-dev) shell_dev ;;
        shell-prod) shell_prod ;;
        backup) backup_db ;;
        clean) clean_docker ;;
        status) show_status ;;
        *) 
            echo "Usage: $0 [build-dev|build-prod|start-dev|start-prod|stop-dev|stop-prod|logs-dev|logs-prod|verify-dev|verify-prod|shell-dev|shell-prod|backup|clean|status]"
            exit 1
            ;;
    esac
fi 