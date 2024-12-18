import { createContext,useContext,useState,useEffect } from "react";
import { auth , db } from "../Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, onAuthStateChanged , GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
//import { getAuth } from "firebase/auth";

import PropTypes from 'prop-types';

const AuthContext = createContext();
export function AuthContextProvider({ children }) {
    
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    function signInwithGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
             else {
                setUser(null);
             };
             setIsLoading(false);
            
        })
      }, [user]);

    function signUp(email, password) {
        createUserWithEmailAndPassword(auth, email, password);
        setDoc(doc(db, "users", email), {
            savedShows: []
        })
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    function logOut() {
        return signOut(auth);
    }


   

    return(
        <AuthContext.Provider value={{signUp ,logIn, logOut, user , isLoading, signInwithGoogle}}>
            {children}
        </AuthContext.Provider>
    )
}



export function UserAuth() {

    return useContext(AuthContext);
}
