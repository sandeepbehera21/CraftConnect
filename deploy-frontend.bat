@echo off
echo Deploying Frontend to Google App Engine...

echo Building React app...
npm run build

echo Deploying to App Engine...
gcloud app deploy frontend-app.yaml

echo Frontend deployment complete!
