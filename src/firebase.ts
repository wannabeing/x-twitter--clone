// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYMBic0IQVZ1POX-rcoYiJJtmV2YT7xdY",
  authDomain: "x-clone-cae4f.firebaseapp.com",
  projectId: "x-clone-cae4f",
  storageBucket: "x-clone-cae4f.appspot.com",
  messagingSenderId: "777779116500",
  appId: "1:777779116500:web:8fa4735aa28e7403fe7e41",
  measurementId: "G-C9F6HE2H99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

logEvent(analytics, "login");
logEvent(analytics, "sign_up");
logEvent(analytics, "screen_view");
logEvent(analytics, "page_view");
logEvent(analytics, "exception");
