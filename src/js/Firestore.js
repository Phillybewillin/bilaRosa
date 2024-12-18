import { db } from "./Firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { useCallback } from "react";
import { toast } from 'react-toastify';

export const useFirestore = () => {
 
  const addDocument = async (collectionName, data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, collectionName), data);
    toast.success("Saved successfully");
    console.log("Document written with ID: ", docRef.id);
  };

  const addToWatchlist = async (userId, dataId, data) => {
    try {
      if (await checkIfInWatchlist(userId, dataId)) {
        toast.error("Item Already In To Your Watchlist");
        return false;
      }
      await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
      toast.success("Added To Your Watchlist");
    } catch (error) {
      console.log(error, "Error adding document");
      toast.error("An error occurred. Please try again.");
    }
  };
  const addToFavourites = async (userId, dataId, data) => {
    try {
      if (await checkIfInFavourites(userId, dataId)) {
        toast.error("Item Already In To Your Watchlist");
        return false;
      }
      await setDoc(doc(db, "users", userId, "favourites", dataId), data);
      toast.success("Added To Your Favourites");
    } catch (error) {
      console.log(error, "Error adding document");
      toast.error("An error occurred. Please try again.");
    }
  };

  const checkIfInWatchlist = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "watchlist",
      dataId?.toString()
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  };
  const checkIfInFavourites = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "favourites",
      dataId?.toString()
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  };

  const removeFromWatchlist = async (userId, dataId) => {
    try {
      await deleteDoc(
        doc(db, "users", userId?.toString(), "watchlist", dataId?.toString())
      );
      toast.success("Removed From Your Watchlist");
    } catch (error) {
        toast.error("An error occurred. Please try again.");
      console.log(error, "Error while deleting doc");
    }
  };
  const removeFromFavourites = async (userId, dataId) => {
    try {
      await deleteDoc(
        doc(db, "users", userId?.toString(), "favourites", dataId?.toString())
      );
      toast.success("Removed From Your Favourites");
    } catch (error) {
        toast.error("An error occurred. Please try again.");
      console.log(error, "Error while deleting doc");
    }
  };

 const getWatchlist = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "watchlist")
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return data;
  }, []);
  const getFavourites = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "favourites")
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return data;
  }, []);

  return {
    addDocument,
    addToWatchlist,
    addToFavourites,
    checkIfInFavourites,
    checkIfInWatchlist,
    removeFromWatchlist,
    removeFromFavourites,
    getWatchlist,
    getFavourites,
  };
};