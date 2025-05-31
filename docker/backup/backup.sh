#!/bin/bash

# Database backup script for Siraty
# This script creates compressed backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="siraty_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="siraty_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo "Starting database backup at $(date)"

# Create database dump
PGPASSWORD=${POSTGRES_PASSWORD} pg_dump \
    -h postgres \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB} \
    --verbose \
    --clean \
    --no-owner \
    --no-privileges \
    > ${BACKUP_DIR}/${BACKUP_FILE}

# Compress the backup
gzip ${BACKUP_DIR}/${BACKUP_FILE}

echo "Backup created: ${COMPRESSED_FILE}"

# Check backup file size
BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${COMPRESSED_FILE} | cut -f1)
echo "Backup size: ${BACKUP_SIZE}"

# Remove old backups older than retention period
echo "Cleaning up old backups (older than ${RETENTION_DAYS} days)..."
find ${BACKUP_DIR} -name "siraty_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# List current backups
echo "Current backups:"
ls -lh ${BACKUP_DIR}/siraty_backup_*.sql.gz 2>/dev/null || echo "No backups found"

echo "Database backup completed at $(date)"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# aws s3 cp ${BACKUP_DIR}/${COMPRESSED_FILE} s3://your-backup-bucket/siraty/
# rclone copy ${BACKUP_DIR}/${COMPRESSED_FILE} remote:siraty-backups/ 