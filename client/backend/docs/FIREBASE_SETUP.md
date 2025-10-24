# Firebase Authentication Setup Guide

## Prerequisites

1. A Google account
2. Access to the Firebase Console

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `geetamanthan-plus` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and configure OAuth consent screen
   - **Anonymous** (optional): For guest users

## Step 3: Generate Service Account Credentials

1. Go to Project Settings (gear icon in left sidebar)
2. Click on the "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-credentials.json`
6. Place it in the `backend/` directory

**Important**: Never commit this file to version control!

## Step 4: Configure Web App

1. In Project Settings, go to "General" tab
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</> icon)
4. Register your app with nickname: `geetamanthan-plus-web`
5. Copy the Firebase configuration object for frontend use

## Step 5: Update Environment Variables

Update your `backend/.env` file:

```env
# Firebase
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

For frontend, create/update `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 6: Security Rules (Optional)

For additional security, you can configure Firestore security rules and Authentication rules in the Firebase Console.

## Testing

1. Start your backend server
2. Check the logs for "Firebase initialized with service account credentials"
3. If you see this message, Firebase is properly configured

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**: Check that `firebase-credentials.json` exists and is valid
2. **Permission errors**: Ensure the service account has the correct roles
3. **Invalid credentials**: Re-download the service account key from Firebase Console

### Required IAM Roles:

Your service account should have these roles:
- Firebase Authentication Admin
- Firebase Rules Admin (if using Firestore)

## Production Deployment

For production deployment:

1. **Vercel/Netlify**: Use environment variables instead of the JSON file
2. **Google Cloud**: Use Application Default Credentials
3. **Other platforms**: Upload the JSON file securely or use environment variables

### Environment Variables for Production:

Instead of the JSON file, you can use these environment variables:

```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

Then modify the Firebase initialization to use these environment variables when the JSON file is not available.