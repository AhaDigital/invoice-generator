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

const stringToSlug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

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
}

const saveInvoiceIncNr = (invoiceNumber) => {
  db.collection('invoiceIncNr').doc('u5FROQpVeUhBzl0CGWFC').update({incrementalNumber: invoiceNumber})
}

const fetchCompanies = async () => {
  const snapshot = await db.collection('company').get()
  return snapshot.docs
}

const saveNewCompany = async (yourRefName, yourRefCompany, yourRefInfo) => {
  if(yourRefName && yourRefCompany && yourRefInfo) {
    const companyRef = db.collection('company').doc(stringToSlug(yourRefCompany))
    const fetchedCompany = await companyRef.get();
  
    if(fetchedCompany.data()) {
      db.collection('company').doc(stringToSlug(yourRefCompany)).update({
        name: yourRefCompany,
        refName: yourRefName,
        address: yourRefInfo
      })
      return {
        success: true,
        msg: `Uppdaterat ${yourRefCompany}`
      }
    } else {
      db.collection('company').doc(stringToSlug(yourRefCompany)).set({
        name: yourRefCompany,
        refName: yourRefName,
        address: yourRefInfo
      })
      return {
        success: true,
        msg: `Skapat ${yourRefCompany}`
      }
    }
  } else {
    return {
      success: false,
      msg: 'Fyll i alla fält'
    }
  }
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

export { 
  fetchInvoiceIncNr,
  AuthContextProvider,
  Login,
  saveInvoiceIncNr,
  saveNewCompany,
  fetchCompanies,
  AuthContext,
}
