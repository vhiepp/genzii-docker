
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiocXHYROTqX1woCclaj1wkOCcHBJVRfY",
  authDomain: "sv5t-tvu-ca74b.firebaseapp.com",
  databaseURL: "https://sv5t-tvu-ca74b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sv5t-tvu-ca74b",
  storageBucket: "sv5t-tvu-ca74b.appspot.com",
  messagingSenderId: "904946556855",
  appId: "1:904946556855:web:8b21588d9b723b65149232"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);