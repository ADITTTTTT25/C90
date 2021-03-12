import firebase from "firebase";
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDadqrmROwa7PR_Fzye5MATeFglCou6hzI",
    authDomain: "booksanta-b5fa3.firebaseapp.com",
    projectId: "booksanta-b5fa3",
    storageBucket: "booksanta-b5fa3.appspot.com",
    messagingSenderId: "38266624422",
    appId: "1:38266624422:web:cacfd7dfa68b5cdeba1767"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();