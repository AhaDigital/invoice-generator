import React, { useState, useEffect } from 'react'
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDOQn78XWL4iyAe-5FEULtXm4N-in_0xGs",
  authDomain: "fakturor-8e9bc.firebaseapp.com",
  projectId: "fakturor-8e9bc",
  storageBucket: "fakturor-8e9bc.appspot.com",
  messagingSenderId: "1022099844839",
  appId: "1:1022099844839:web:32fef155a25bdde6403c42"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()

const Login = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    return true
  })
  .catch((error) => {
    return {
      error: true,
      code: error.code
    }
  });
}

const fetchInvoiceIncNr = async () => {
  const invoiceIncNrRef = db.collection('invoiceIncNr').doc('u5FROQpVeUhBzl0CGWFC')
  let incrNr = await invoiceIncNrRef.get();
  return incrNr.data()
  // for(const doc of incrNr.docs){
  //   return doc.data()
  // }
}

const saveInvoiceIncNr = (invoiceNumber) => {
  db.collection('invoiceIncNr').doc('u5FROQpVeUhBzl0CGWFC').update({incrementalNumber: invoiceNumber})
}

const AuthContext = React.createContext();
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = firebase.auth().currentUser;

    return user;
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
    });
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export { fetchInvoiceIncNr, AuthContextProvider, Login, AuthContext, saveInvoiceIncNr }
