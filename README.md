# React Punch Trainer

A very simple React app to generate punch combinations for boxing workouts.

## Instructions to Run

-   `npm install`
-   `npm run dev`

## Building for Production

-   `npm run build` - Builds the app for production in the `dist` folder

## Deploying to S3

1. Make sure you have AWS CLI installed and configured
2. Deploy to S3: `./deploy.sh <your-bucket-name>`

The script will automatically build the project if needed.

The deployment script will:
- Build the project if needed
- Sync all files to S3 with appropriate cache headers
- Set `index.html` with no cache (for SPA routing)
- Set assets with long cache (1 year) for optimal performance

**Note:** Make sure your S3 bucket is configured for static website hosting if you're using the S3 website endpoint, or configure CloudFront for HTTPS.
