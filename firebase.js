import * as firebase from 'firebase';
import 'firebase/firebase-firestore'
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAn1edBTLHOhoGS-XHvzDizxp-K16OVIcs",
  authDomain: "nbccbusattendance.firebaseapp.com",
  databaseURL: "https://nbccbusattendance.firebaseio.com",
  projectId: "nbccbusattendance",
  storageBucket: "nbccbusattendance.appspot.com",
  messagingSenderId: "147090842093",
  appId: "1:147090842093:web:e19c3226e9079145f887e4",
  measurementId: "G-SCR6YLDZXF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export default firestore;
