import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin (singleton pattern)
let firebaseApp: admin.app.App | null = null;

export function initializeFirebaseAdmin(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Try to load from environment variable first (preferred for production/Vercel)
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountEnv) {
      const serviceAccount = JSON.parse(serviceAccountEnv);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'fiato-corto-ba53e.firebasestorage.app',
      });
      console.log('✅ Firebase Admin initialized from environment variable');
      return firebaseApp;
    }

    // Try to load from file (for local development only - not available in serverless)
    try {
      const possiblePaths = [
        path.join(__dirname, '../../fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'),
        path.join(process.cwd(), 'fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'),
        path.join(process.cwd(), 'backend', 'fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'),
      ];

      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(possiblePath, 'utf8'));
          firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: serviceAccount.project_id 
              ? `${serviceAccount.project_id}.firebasestorage.app`
              : 'fiato-corto-ba53e.firebasestorage.app',
          });
          console.log('✅ Firebase Admin initialized from service account file:', possiblePath);
          return firebaseApp;
        }
      }
    } catch (fileError: any) {
      // In serverless environments, fs might not be available - this is OK
      console.log('ℹ️ File-based credentials not available (expected in serverless):', fileError.message);
    }

    // Try GOOGLE_APPLICATION_CREDENTIALS (for GCP environments)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'fiato-corto-ba53e.firebasestorage.app',
      });
      console.log('✅ Firebase Admin initialized from GOOGLE_APPLICATION_CREDENTIALS');
      return firebaseApp;
    }

    throw new Error('Firebase Admin configuration not found');
  } catch (error: any) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    throw error;
  }
}

// Get Firebase Admin app instance
export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    return initializeFirebaseAdmin();
  }
  return firebaseApp;
}

// Get Firebase Storage bucket
export function getStorageBucket(): admin.storage.Storage {
  const app = getFirebaseAdmin();
  return app.storage();
}

// Upload file buffer to Firebase Storage
export async function uploadFileToStorage(
  buffer: Buffer,
  fileName: string,
  folder: 'tour-images' | 'gpx-tracks' = 'tour-images',
  contentType?: string
): Promise<string> {
  try {
    const bucket = getStorageBucket().bucket();
    const filePath = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}-${fileName}`;
    const file = bucket.file(filePath);

    // Upload buffer
    await file.save(buffer, {
      metadata: {
        contentType: contentType || 'application/octet-stream',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
      public: true, // Make file publicly accessible
    });

    // Get public URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Far future date (max allowed)
    });

    // For public files, we can also use the public URL directly
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    console.log(`✅ File uploaded to Firebase Storage: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error('❌ Error uploading file to Firebase Storage:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// Delete file from Firebase Storage by URL
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  try {
    const bucket = getStorageBucket().bucket();
    
    // Extract file path from URL
    // URL format: https://storage.googleapis.com/bucket-name/path/to/file
    const urlPattern = /https:\/\/storage\.googleapis\.com\/([^/]+)\/(.+)/;
    const match = fileUrl.match(urlPattern);
    
    if (!match) {
      // Try to extract from other URL formats
      const gsPattern = /gs:\/\/([^/]+)\/(.+)/;
      const gsMatch = fileUrl.match(gsPattern);
      
      if (gsMatch) {
        const [, bucketName, filePath] = gsMatch;
        if (bucketName === bucket.name) {
          await bucket.file(filePath).delete();
          console.log(`✅ File deleted from Firebase Storage: ${filePath}`);
          return;
        }
      }
      
      throw new Error(`Invalid file URL format: ${fileUrl}`);
    }

    const [, bucketName, filePath] = match;
    
    if (bucketName !== bucket.name) {
      throw new Error(`File belongs to different bucket: ${bucketName}`);
    }

    await bucket.file(filePath).delete();
    console.log(`✅ File deleted from Firebase Storage: ${filePath}`);
  } catch (error: any) {
    console.error('❌ Error deleting file from Firebase Storage:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// Delete file from Firebase Storage by path
export async function deleteFileByPath(filePath: string): Promise<void> {
  try {
    const bucket = getStorageBucket().bucket();
    await bucket.file(filePath).delete();
    console.log(`✅ File deleted from Firebase Storage: ${filePath}`);
  } catch (error: any) {
    console.error('❌ Error deleting file from Firebase Storage:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// Initialize on module load (for serverless compatibility)
if (process.env.NODE_ENV !== 'test') {
  try {
    initializeFirebaseAdmin();
  } catch (error) {
    console.warn('⚠️ Firebase Admin will be initialized lazily');
  }
}

