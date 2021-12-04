import React ,{ useContext, useState, useEffect }from 'react';
import { auth } from './firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

  
    function signup(email, password,username) {
      return auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
          displayName : username
        })
        })
    }
  
    function login(email, password) {
      return auth.signInWithEmailAndPassword(email, password)
    }
  
    function logout() {
      return auth.signOut()
    }
  
    function resetPassword(email) {
      return auth.sendPasswordResetEmail(email)
    }
  
    function updateEmail(email) {
      return currentUser.updateEmail(email)
    }
  
    function updatePassword(password) {
      return currentUser.updatePassword(password)
    }

    function updateUserName(userName) {
      return currentUser.updateProfile({
        displayName : userName
      });
    }

    function verifyEmail(){
      return currentUser.sendEmailVerification();

    }

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setLoading(false)
      })
  
      return unsubscribe
    }, [])
  
    const value = {
      currentUser,
      login,
      signup,
      logout,
      resetPassword,
      updateEmail,
      updatePassword,
      verifyEmail,
      updateUserName
    }
  
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    )
  }