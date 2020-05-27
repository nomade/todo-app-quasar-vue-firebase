import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "leus-quasar-todo.firebaseapp.com",
  databaseURL: "https://leus-quasar-todo.firebaseio.com",
  projectId: "leus-quasar-todo",
  storageBucket: "leus-quasar-todo.appspot.com",
  messagingSenderId: "XXX",
  appId: "XXX",
  measurementId: "XXX"
};

export default firebase.initializeApp(firebaseConfig);