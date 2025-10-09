
# Cnexi Cross Platform

**Cnexi** is a modern social media platform for sharing short videos and images. This repository contains the **React Native + Expo frontend client**.

---

## Project Structure

```
/Cnexi
├── assets/         # Images and icons
├── components/     # Reusable UI components
├── navigation/     # App navigation (Stack & Tab)
├── screens/        # Screen components
├── utils/          # Utilities and helpers
├── services/       # API calls and configs
├── contexts/       # Global state management
├── hooks/          # Custom hooks
├── App.js          # App entry point
└── package.json    # Dependencies and scripts
```

---

## Installation

**Prerequisites:**  
Nodejs
Expo
Yarn

**Steps:**
```sh
git clone https://github.com/radmanwise/Cnexi.git
cd Cnexi
yarn install
yarn start
```

---

## Configuration

Create a `.env` file in the project root:

```
API_BASE_URL=https://api.cnexi.com
```

---

## API Endpoints (Sample)

| Endpoint                | Method | Description                 |
|-------------------------|--------|-----------------------------|
| `/auth/login/`          | POST   | User login                  |
| `/auth/signup/`         | POST   | User signup                 |
| `/posts/`               | GET    | Fetch all posts             |
| `/posts/{id}/`          | GET    | Fetch single post           |
| `/users/{id}/`          | GET    | Fetch user profile          |
| `/posts/{id}/comments/` | GET    | Fetch post comments         |
| `/notifications/`       | GET    | Fetch notifications         |

---

## Features

**Authentication & User Management**  
- Sign up and login via username  
- Profile editing and avatar updates  
- Follow/unfollow other users  

**Post System**  
- Upload images and short videos  
- Like, comment, and share posts  
- Multi-slide (carousel) support  
- Automatic post categorization  

**User Experience**  
- Infinite scrolling feed  
- Pull-to-refresh  
- Custom modal for comments (with image support)  
- Dark mode  

**Performance**  
- Optimized video playback with expo-av  
- Efficient state management and API requests  

**Upcoming**  
- Real-time notifications  
- Advanced search and filtering  

---

## Contact

Questions or feedback? Visit [cnexi.com](https://cnexi.com)

---

Happy Coding!

