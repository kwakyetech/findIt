---
description: How to deploy the application to Firebase Hosting
---

# Deploy to Firebase Hosting

Since you are already using Firebase for the database and auth, Firebase Hosting is the best place to host your app.

## Prerequisites
- You must be logged into the Firebase Console.
- You must have the project created in Firebase.

## Steps

1.  **Install Firebase CLI** (if you haven't already)
    ```powershell
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**
    ```powershell
    firebase login
    ```
    *   This will open your browser. Log in with the Google account you used for your Firebase project.

3.  **Initialize Hosting**
    ```powershell
    firebase init hosting
    ```
    *   **Are you ready to proceed?** -> `Y`
    *   **Please select an option:** -> Select `Use an existing project`
    *   **Select a default Firebase project:** -> Choose your `findIt` project from the list.
    *   **What do you want to use as your public directory?** -> Type `dist` (This is important! Vite builds to `dist`).
    *   **Configure as a single-page app (rewrite all urls to /index.html)?** -> `Y`
    *   **Set up automatic builds and deploys with GitHub?** -> `N` (You can set this up later if you want).
    *   **File dist/index.html already exists. Overwrite?** -> `N` (Do NOT overwrite).

4.  **Build the Project**
    Make sure you have the latest version built.
    ```powershell
    npm run build
    ```

5.  **Deploy**
    ```powershell
    firebase deploy
    ```

6.  **Done!**
    The terminal will show you the **Hosting URL**. Click it to view your live site.
