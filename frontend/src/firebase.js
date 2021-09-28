import Vue from "vue";
import { firestorePlugin } from "vuefire";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

Vue.use(firestorePlugin);

// Get a Firestore instance
firebase.initializeApp({
  apiKey: "AIzaSyBr2nTox7lHDK_ypcjQjR9DIfAyg9Mi12A",
  authDomain: "rakuten-6e843.firebaseapp.com",
  databaseURL: "https://rakuten-6e843-default-rtdb.firebaseio.com",
  projectId: "rakuten-6e843",
  storageBucket: "rakuten-6e843.appspot.com",
  messagingSenderId: "127638959140",
  appId: "1:127638959140:web:b4e157835e166285f594b1",
  measurementId: "G-5E1QJJ7Y7D",
});

export const db = firebase.firestore();
export const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
