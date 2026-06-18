import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "../config/firebase";

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User's full name
 * @returns {Promise} User object
 */
export const registerUser = async (email, password, displayName) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
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
        displayName: user.displayName,
        createdAt: user.metadata.creationTime,
      },
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Registration error:", error.code, error.message);

    const errorMessages = {
      "auth/email-already-in-use": "Email already in use",
      "auth/invalid-email": "Invalid email address",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/operation-not-allowed": "Sign up is currently disabled",
      "auth/network-request-failed": "Network error. Check your connection.",
    };

    const message = errorMessages[error.code] || error.message || "Registration failed";
    throw new Error(message);
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User object and token
 */
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token for backend calls
    const idToken = await user.getIdToken();

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      },
      token: idToken,
      message: "Sign in successful",
    };
  } catch (error) {
    console.error("Sign in error:", error.code, error.message);

    const errorMessages = {
      "auth/user-not-found": "User not found. Please sign up.",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-email": "Invalid email address",
      "auth/user-disabled": "This user account is disabled",
      "auth/too-many-requests": "Too many failed login attempts. Try again later.",
      "auth/invalid-credential": "Invalid email or password",
      "auth/network-request-failed": "Network error. Check your connection.",
    };

    const message = errorMessages[error.code] || error.message || "Sign in failed";
    throw new Error(message);
  }
};

/**
 * Sign out current user
 * @returns {Promise} Sign out status
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "Sign out successful",
    };
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error(error.message || "Sign out failed");
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
 * Get current user's ID token
 * @returns {Promise} ID token
 */
export const getUserToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user signed in");
    }
    return await user.getIdToken();
  } catch (error) {
    console.error("Get token error:", error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function (user) => {}
 * @returns {Function} Unsubscribe function
 */
export const listenToAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Update user profile
 * @param {Object} updates - Object with displayName, photoURL etc
 * @returns {Promise} Updated user
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user signed in");
    }

    await updateProfile(user, updates);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};

export default auth;
