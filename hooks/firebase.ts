import { FirebaseOptions, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyC_msK_gPd5bma2pjuZ-UhmbxzJgX_R-ck",
    authDomain: "tkdkid1000-webapp.firebaseapp.com",
    databaseURL: "https://tkdkid1000-webapp-default-rtdb.firebaseio.com",
    projectId: "tkdkid1000-webapp",
    storageBucket: "tkdkid1000-webapp.appspot.com",
    messagingSenderId: "204865871998",
    appId: "1:204865871998:web:b556be48104cf29577f82f",
    measurementId: "G-ECE0V02FE8"
} as FirebaseOptions

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const database = getDatabase(app)
const storage = getStorage(app)
const firestore = getFirestore(app)

export { auth, database, storage, firestore }
