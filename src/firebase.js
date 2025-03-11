import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqQcQFLQjDxLdQKnB3hCUj-3NIwWXB4Mk",
  authDomain: "spilcafe-games-management.firebaseapp.com",
  projectId: "spilcafe-games-management",
  storageBucket: "spilcafe-games-management.firebasestorage.app",
  messagingSenderId: "1073953765667",
  appId: "1:1073953765667:web:22b2de3eaaa476bb527496"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
