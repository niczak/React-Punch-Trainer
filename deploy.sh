#!/bin/bash

# S3 Deployment Script for React Punch Trainer
# Usage: ./deploy.sh [bucket-name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: S3 bucket name is required${NC}"
    echo "Usage: ./deploy.sh <bucket-name>"
    echo "Example: ./deploy.sh my-punch-trainer-bucket"
    exit 1
fi

BUCKET_NAME=$1
DIST_DIR="dist"

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${YELLOW}Building project first...${NC}"
    npm run build
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Please install it from: https://aws.amazon.com/cli/"
    exit 1
fi

echo -e "${GREEN}Deploying to S3 bucket: ${BUCKET_NAME}${NC}"

# Sync all files except index.html (assets get long cache)
aws s3 sync $DIST_DIR s3://$BUCKET_NAME \
    --delete \
    --exclude ".DS_Store" \
    --exclude "*.map" \
    --exclude "index.html" \
    --cache-control "public, max-age=31536000, immutable"

# Upload index.html with no cache (for SPA routing and updates)
aws s3 cp $DIST_DIR/index.html s3://$BUCKET_NAME/index.html \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

# Enable static website hosting (optional - uncomment if needed)
# aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Set bucket policy for public read access (optional - adjust as needed)
# aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "Visit your site at: ${YELLOW}http://${BUCKET_NAME}.s3-website-<region>.amazonaws.com${NC}"
echo -e "Or if using CloudFront: ${YELLOW}https://your-cloudfront-domain.com${NC}"
