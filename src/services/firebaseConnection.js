import firebase from "firebase/compat/app";
import "firebase/compat/auth";  // Corrija aqui, adicione /compat/
import "firebase/compat/firestore";
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBI2AEXkwrrW7vm5adRaGXM5a4v6jx6OUQ",
  authDomain: "call-system-af3ec.firebaseapp.com",
  projectId: "call-system-af3ec",
  storageBucket: "call-system-af3ec.appspot.com",
  messagingSenderId: "221533578144",
  appId: "1:221533578144:web:2532bd7dd1373941fe7ac5",
  measurementId: "G-1S9M5YHVTX"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const dbFirebase = firebase;
