# Development Dockerfile for Siraty
# Optimized for hot reloading and development experience

FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Development image with all tools
FROM base AS development

# Install LibreOffice, Pandoc, and development tools
RUN apk add --no-cache \
    # Document processing tools
    libreoffice \
    pandoc \
    openjdk11-jre \
    # Font support
    fontconfig \
    ttf-dejavu \
    ttf-liberation \
    msttcorefonts-installer \
    # Development and debugging tools
    curl \
    bash \
    git \
    vim \
    htop \
    procps \
    net-tools \
    postgresql-client \
    # Build tools
    python3 \
    make \
    g++ \
    && update-ms-fonts \
    && fc-cache -f \
    && rm -rf /var/cache/apk/*

# Install additional fonts for international support
RUN apk add --no-cache \
    font-noto \
    font-noto-arabic \
    font-noto-cjk \
    && fc-cache -f \
    && rm -rf /var/cache/apk/*

# Install all dependencies (including dev dependencies)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code (will be overridden by volume mount in docker-compose)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Verify document processing tools installation
RUN libreoffice --version && pandoc --version

# Expose port
EXPOSE 3000

# Development environment variables
ENV PORT 3000
ENV NODE_ENV development

# Start development server with hot reloading
CMD ["npm", "run", "dev"] 