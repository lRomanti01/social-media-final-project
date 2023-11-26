import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2U3g8Pn_VkkAM-w-QUTIsZL_AYX54RZs",
  authDomain: "social-media-final-project.firebaseapp.com",
  projectId: "social-media-final-project",
  storageBucket: "social-media-final-project.appspot.com",
  messagingSenderId: "323748830579",
  appId: "1:323748830579:web:8b38ed02a47f55bae57906"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);


export { db, auth, provider, storage };