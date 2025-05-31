#!/bin/sh

# Development startup script for Siraty
# This script ensures Prisma is properly configured and starts the dev server

set -e

echo "🚀 Starting Siraty Development Environment..."

# Docker's depends_on health check ensures PostgreSQL is ready
echo "⏳ Initializing database connection..."
sleep 5  # Give a moment for full initialization

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database (for development)
echo "📊 Pushing Prisma schema to database..."
npx prisma db push --accept-data-loss

echo "🎉 Database is ready!"

# Start the development server
echo "🔥 Starting Next.js development server with hot reloading..."
echo "🌐 Application will be available at: http://localhost:3000"
echo "📁 File watching enabled - changes to your source files will trigger automatic reloads"
echo "⚡ Hot reloading is configured for Docker environment"

exec npm run dev 