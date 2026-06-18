import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgtRoYUF7ZATzvLIytsbJN36tIbD8MT1g",
  authDomain: "famjoy-3ccdc.firebaseapp.com",
  projectId: "famjoy-3ccdc",
  storageBucket: "famjoy-3ccdc.firebasestorage.app",
  messagingSenderId: "991753277036",
  appId: "1:991753277036:web:8e9341522b583fb79b5249"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
