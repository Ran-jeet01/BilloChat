import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create user document in Firestore
  const createUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { email } = user;
      const { firstName, lastName } = additionalData;

      try {
        await setDoc(userRef, {
          uid: user.uid,
          email,
          firstName,
          lastName,
          username: `${firstName} ${lastName}`,
          status: "Hey there! I am using Billo Chat",
          createdAt: new Date(),
          lastSeen: new Date(),
          profilePic: "",
        });

        // Create empty subcollections
        await setDoc(doc(db, "users", user.uid, "groups", "initial"), {});
        await setDoc(doc(db, "users", user.uid, "peoples", "initial"), {});
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    }
    return userRef;
  };

  // Sign up with email/password
  const signup = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await createUserDocument(user, { firstName, lastName });

      // Get the created user document
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUserData(userDoc.data());

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update last seen
      await updateDoc(doc(db, "users", user.uid), {
        lastSeen: new Date(),
        status: "online",
      });

      // Get user data
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUserData(userDoc.data());

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Social login (Google)
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document if it doesn't exist
      const firstName = user.displayName?.split(" ")[0] || "";
      const lastName = user.displayName?.split(" ")[1] || "";
      await createUserDocument(user, { firstName, lastName });

      // Get user data
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUserData(userDoc.data());

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Social login (Facebook)
  const facebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document if it doesn't exist
      const firstName = user.displayName?.split(" ")[0] || "";
      const lastName = user.displayName?.split(" ")[1] || "";
      await createUserDocument(user, { firstName, lastName });

      // Get user data
      const userDoc = await getDoc(doc(db, "users", user.uid));
      setUserData(userDoc.data());

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          status: "offline",
          lastSeen: new Date(),
        });
      }
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (userId, updates) => {
    try {
      await updateDoc(doc(db, "users", userId), updates);
      const userDoc = await getDoc(doc(db, "users", userId));
      setUserData(userDoc.data());
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Update user status to online
        await updateDoc(doc(db, "users", user.uid), {
          status: "online",
          lastSeen: new Date(),
        });
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      if (currentUser) {
        updateDoc(doc(db, "users", currentUser.uid), {
          status: "offline",
          lastSeen: new Date(),
        });
      }
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    googleLogin,
    facebookLogin,
    logout,
    updateProfile,
    getAllUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
