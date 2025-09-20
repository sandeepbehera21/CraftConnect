@echo off
echo Deploying Backend to Google App Engine...

cd backend

echo Installing dependencies...
npm install

echo Deploying to App Engine...
gcloud app deploy

echo Backend deployment complete!
echo Note the URL and update your frontend config.js
