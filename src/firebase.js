// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqQcQFLQjDxLdQKnB3hCUj-3NIwWXB4Mk",
  authDomain: "spilcafe-games-management.firebaseapp.com",
  projectId: "spilcafe-games-management",
  storageBucket: "spilcafe-games-management.appspot.com", // This was incorrect
  messagingSenderId: "1073953765667",
  appId: "1:1073953765667:web:22b2de3eaaa476bb527496"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
