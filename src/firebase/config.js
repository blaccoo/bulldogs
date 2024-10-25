//* Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

//* Add the Web App's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAk-TuRLyIe5TGeRLgIiwMx1vLtDiabD9I",
  authDomain: "bulldogs-f47d1.firebaseapp.com",
  projectId: "bulldogs-f47d1",
  storageBucket: "bulldogs-f47d1.appspot.com",
  messagingSenderId: "31405723079",
  appId: "1:31405723079:web:662837c03307eb856b5de2",
  measurementId: "G-KPRWHP3JNX"
};

//* Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//* Initialize Firebase Auth and set persistence
const auth = getAuth(firebase_app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Failed to set session persistence:", error);
  });

export { auth };
export default firebase_app;
