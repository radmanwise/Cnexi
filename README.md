# Cnexi Cross Platform

Welcome to **Cnexi**, a modern social media platform for sharing short videos and images. This repository contains the **frontend client**, built with **React Native** and **Expo**. 

---

## 📂 Project Structure
```
/Cnexi
├── assets/            # Static assets (images, icons)
├── components/        # Reusable UI components
├── navigation/        # Navigation setup (Stack & Tab)
├── screens/           # Screen components (pages)
├── utils/             # Utility functions and helpers
├── services/          # API interactions and configurations
├── contexts/          # Global state management (if any)
├── hooks/             # Custom React hooks
├── App.js             # Entry point
└── package.json       # Dependencies and scripts
```
---

## ⚙️ Setup & Installation
### 🔹 Prerequisites
 [Node.js](https://nodejs.org/)

[Expo CLI](https://docs.expo.dev/get-started/installation/)

 [Yarn](https://yarnpkg.com/)

### 🔹 Installation Steps
```sh
# Clone the repository
git clone https://github.com/jassonvoss/cnexi-cross-platform.git
cd cnexi-cross-platform

# Install dependencies
yarn install

# Start the development server
yarn start
```
---

## 🔧 Configuration
Create a `.env` file in the root directory and set up your API base URL:
```
API_BASE_URL=https://api.cnexi.com
```
---

## 📡 API Endpoints
| Endpoint                | Method |  Description                  |
|-------------------------|--------|------------------------------|
| `/auth/login/`          | POST   | User login                   |
| `/auth/signup/`         | POST   | User signup                  |
| `/posts/`               | GET    | Fetch all posts              |
| `/posts/{id}/`          | GET    | Fetch single post            |
| `/users/{id}/`          | GET    | Fetch user profile           |
| `/posts/{id}/comments/` | GET    | Fetch comments of a post     |
| `/notifications/`       | GET    | Fetch user notifications     |
---

##  Features
### 🔐 Authentication & User Management
✔️ Signup/Login via username  
✔️ Profile management (edit profile, update avatar, follow/unfollow users)  

### 🎬 Post System
✔️ Upload images and short videos  
✔️ Like, comment, and share posts  
✔️ Multi-slide post support (carousel for multiple images/videos)  
✔️ Category auto-detection for posts  

### 🎨 UI & UX
✔️ Infinite scrolling feed  
✔️ Pull-to-refresh for profile & feed screens  
✔️ Custom modal for comments (with image attachment support)  
✔️ Dark mode support  

### ⚡ Performance & Optimization
✔️ Optimized video playback using **expo-av**  
✔️ Efficient state management & API calls  

### 🔮 Upcoming Features
✨ Real-time notifications  
✨ Enhanced search and filtering  

---

## 📬 Contact
For any inquiries, visit [cnexi.com](https://cnexi.com)

Happy Coding! 🎉

