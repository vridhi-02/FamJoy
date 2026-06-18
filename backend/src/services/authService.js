import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../config/firebase";

/**
 * Register/Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User credential object
 */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
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
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default auth;