import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID
};

firebase.initializeApp(firebaseConfig);

// utils
const fbfs = firebase.firestore();
const auth = firebase.auth();
const func = firebase.functions();
const storage = firebase.storage();

if (location.hostname === "localhost") {
  fbfs.useEmulator("localhost", 8090);
  auth.useEmulator("http://localhost:9099");
  func.useEmulator("localhost", 5001);
}

// collection references
const ranksCollection = fbfs.collection("ranksConfiguration");
const usersCollection = fbfs.collection("users");
const binaryTreeCollection = fbfs.collection("binary-tree");

// export utils/refs
export {
  fbfs,
  auth,
  func,
  storage,
  binaryTreeCollection,
  ranksCollection,
  usersCollection
};
