# findIt - Lost & Found Application

**findIt** is a modern, community-driven Lost and Found web application designed to help people reconnect with their lost belongings. Built with React and Firebase, it offers a seamless experience for reporting lost or found items, complete with interactive maps and real-time updates.

![findIt Screenshot](https://via.placeholder.com/800x400?text=findIt+Dashboard)

## 🚀 Features

-   **User Authentication**: Secure Sign Up and Login using Firebase Auth.
-   **Report Items**: Easily report lost or found items with details, images, and location.
-   **Interactive Map View**:
    -   Visualize items on a global map.
    -   **Pin Location**: Click on the map to set the exact location when reporting.
    -   **Location Search**: Search for landmarks or addresses to quickly pin coordinates.
-   **Search & Filter**: Quickly find items by keyword, type (Lost/Found), or browse the grid.
-   **Dashboard**: A clean, responsive grid view of all reported items.
-   **Admin Dashboard**: Dedicated view for administrators to manage listings.
-   **User Settings**: Manage your profile and security settings.
-   **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite
-   **Styling**: Tailwind CSS 4
-   **Backend / Database**: Firebase (Authentication & Firestore)
-   **Maps**: React Leaflet, Leaflet, OpenStreetMap
-   **Icons**: Lucide React
-   **Notifications**: React Hot Toast

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/findIt.git
    cd findIt
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    -   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Authentication** (Email/Password).
    -   Enable **Cloud Firestore** (Create a database).
    -   Create a `.env` file in the root directory and add your Firebase config keys:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 🗺️ Map Configuration
This project uses **OpenStreetMap** via **Leaflet**, which requires no API key for standard usage. The location search is powered by the **Nominatim API**.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
