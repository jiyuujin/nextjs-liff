import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth'

const firebaseApp: FirebaseApp = initializeApp({
  apiKey: process.env.NEXT_APP_FIREBASE_KEY,
  authDomain: process.env.NEXT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.NEXT_APP_FIREBASE_DATABASE,
  projectId: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_APP_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_APP_FIREBASE_APPID,
})

export const auth: Auth = getAuth(firebaseApp)

export const authState = (dispatch) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch({
        type: 'login',
        payload: {
          user,
        },
      })
    } else {
      dispatch({
        type: 'logout',
      })
    }
  })
}

export const signIn = () => {
  const provider = new GoogleAuthProvider()
  signInWithRedirect(auth, provider)
    .then((result) => {
      return result
    })
    .catch((error) => {
      console.error({ error })
    })
}

export const signOut = () => {
  auth.signOut().then(() => {
    window.location.reload()
  })
}
