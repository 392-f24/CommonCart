// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase,  onValue, ref, update, get,} from "firebase/database"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { useCallback, useState, useEffect } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDz9v7nY_nN68DUVXsWm9dhWLFAAYH_hQ8",
  authDomain: "commoncart-1458a.firebaseapp.com",
  databaseURL: "https://commoncart-1458a-default-rtdb.firebaseio.com/",
  projectId: "commoncart-1458a",
  storageBucket: "commoncart-1458a.appspot.com",
  messagingSenderId: "486216307797",
  appId: "1:486216307797:web:8f04e048ff6e18c334f0dc",
  measurementId: "G-BNS92BNR7M"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

const database = getDatabase(firebase);
const auth = getAuth(firebase);

export { firebase, database, auth };

export const signInWithGoogle = async() => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result;
};

export const signOut = () => firebaseSignOut(auth);

export const useAuthState = () => {
    const [user, setUser] = useState();
    useEffect(() => (
        onAuthStateChanged(auth, setUser)
    ), []);

    return [user];
};

export const useDbData = (path) => {
    const [data, setData] = useState();
    const [error, setError] = useState(null);

    useEffect(() => (
        onValue(ref(database, path), (snapshot) => {
            setData(snapshot.val());
        }, (error) => {
            setError(error);
        })
    ), [path]);

    return [data, error];
};

export const useDbAdd = (path) => {
    const [result, setResult] = useState(null);
  
    // Given data and a key, the key is used to create a new path for the data
    const add = async (data, key) => {
        try {
            console.log('Attempting to add data:', data, 'at path:', `${path}/${key}`);
            const newRef = ref(database, `${path}/${key}`); // Use the key passed in the argument
            console.log('New reference:', newRef);
            await set(newRef, data); // Set data at the specified reference
            setResult({ message: 'Request added successfully!', error: false });
            console.log('Data added successfully!'); // Confirm successful addition
          } catch (error) {
            console.error('Error saving data:', error); // Log errors
            setResult({ message: error.message, error: true });
          }
      };
  
    return [add, result];
  };