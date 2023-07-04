import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBqDfyIdKN4LdnyGNUUF4KvlVL6LGYO6GU",
  authDomain: "javesshhh-chatapp.firebaseapp.com",
  projectId: "javesshhh-chatapp",
  storageBucket: "javesshhh-chatapp.appspot.com",
  messagingSenderId: "934507939199",
  appId: "1:934507939199:web:e650ab20dc50ca8ebc464a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);