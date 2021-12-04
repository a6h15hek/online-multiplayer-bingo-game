import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
  
  
  // Initialize Firebase
const app =  firebase.initializeApp(firebaseConfig);
const auth = app.auth();
export {app , auth};
