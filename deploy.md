# Google Cloud Deployment Guide

## Prerequisites

1. Google Cloud Account (free tier available)
2. Google Cloud SDK installed locally
3. MongoDB Atlas account (free tier)
4. Gemini API key

## Step 1: Setup Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - App Engine Admin API
   - Cloud Build API

## Step 2: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with actual password)

## Step 3: Deploy Backend

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Initialize App Engine:

   ```bash
   gcloud app create --region=us-central
   ```

3. Deploy backend:

   ```bash
   gcloud app deploy
   ```

4. Note the backend URL (e.g., `https://your-project-id.appspot.com`)

## Step 4: Deploy Frontend

1. Update `src/config.js` with your backend URL:

   ```javascript
   export const API_BASE_URL = "https://your-project-id.appspot.com";
   ```

2. Build the frontend:

   ```bash
   npm run build
   ```

3. Deploy frontend:
   ```bash
   gcloud app deploy frontend-app.yaml
   ```

## Step 5: Environment Variables

Set these in Google Cloud Console > App Engine > Settings > Environment Variables:

- `MONGO_URI`: Your MongoDB Atlas connection string
- `GEMINI_API_KEY`: Your Gemini API key
- `ADMIN_EMAIL`: Your Gmail address
- `ADMIN_EMAIL_APP_PASSWORD`: Gmail app password
- `JWT_SECRET`: A random secret string
- `FRONTEND_ORIGIN`: Your frontend URL

## Step 6: Test Deployment

1. Visit your frontend URL
2. Test signup/login
3. Test product creation
4. Test chatbot functionality

## Free Tier Limits

- **App Engine**: 28 frontend instance hours, 9 backend instance hours per day
- **Cloud Storage**: 5GB free
- **MongoDB Atlas**: 512MB free storage

## Troubleshooting

1. **CORS Issues**: Update `FRONTEND_ORIGIN` in backend environment variables
2. **Database Connection**: Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for App Engine)
3. **File Uploads**: App Engine has file size limits, consider using Cloud Storage for production

## Cost Optimization

- Use `min_instances: 0` to scale down when not in use
- Monitor usage in Google Cloud Console
- Set up billing alerts
