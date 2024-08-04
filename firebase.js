// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQk7l9g6BxT1Y432GENf7RXx0vprbx1wg",
  authDomain: "inventory-management-91740.firebaseapp.com",
  projectId: "inventory-management-91740",
  storageBucket: "inventory-management-91740.appspot.com",
  messagingSenderId: "716858750589",
  appId: "1:716858750589:web:6ae471af5c996523db6314",
  measurementId: "G-0SBN5GDRL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}