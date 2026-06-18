import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgtRoYUF7ZATzvLIytsbJN36tIbD8MT1g",
  authDomain: "famjoy-3ccdc.firebaseapp.com",
  projectId: "famjoy-3ccdc",
  storageBucket: "famjoy-3ccdc.firebasestorage.app",
  messagingSenderId: "991753277036",
  appId: "1:991753277036:web:8e9341522b583fb79b5249",
};

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/**
 * Register/Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User's full name
 * @returns {Promise} User credential object
 */
export const registerUser = async (email, password, displayName = "") => {
  try {
    if (!auth) throw new Error("Firebase not initialized");

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName,
      });
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
      },
      message: "Sign up successful",
    };
  } catch (error) {
    console.error("Registration error:", error.code, error.message);

    const errorMessages = {
      "auth/email-already-in-use": "Email already in use",
      "auth/invalid-email": "Invalid email address",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/operation-not-allowed": "Sign up is currently disabled",
    };

    throw new Error(
      errorMessages[error.code] || error.message || "Sign up failed"
    );
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User credential object
 */
export const loginUser = async (email, password) => {
  try {
    if (!auth) throw new Error("Firebase not initialized");

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error.code, error.message);

    const errorMessages = {
      "auth/user-not-found": "User not found. Please sign up.",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-email": "Invalid email address",
      "auth/user-disabled": "This user account is disabled",
      "auth/too-many-requests": "Too many failed login attempts. Try again later.",
      "auth/invalid-credential": "Invalid email or password",
    };

    throw new Error(
      errorMessages[error.code] || error.message || "Login failed"
    );
  }
};

/**
 * Logout current user
 * @returns {Promise} Logout status
 */
export const logoutUser = async () => {
  try {
    if (!auth) throw new Error("Firebase not initialized");

    await signOut(auth);
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(error.message || "Logout failed");
  }
};

/**
 * Get current authenticated user
 * @returns {Object} Current user or null
 */
export const getCurrentUser = () => {
  if (!auth) return null;
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  if (!auth) {
    console.error("Firebase not initialized");
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

export default auth;
