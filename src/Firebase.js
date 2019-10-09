import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/firestore'
// import { Base64 } from 'js-base64'

// const firebaseConfig = JSON.parse(Base64.decode(process.env.REACT_APP_KEYS_B64));
// firebase.initializeApp(firebaseConfig);

const config = {
    apiKey: "AIzaSyB-ctVVpaU3DsuU-sZe9UhNEGLZ_u5XKcQ",
    authDomain: "playback-2a438.firebaseapp.com",
    databaseURL: "https://playback-2a438.firebaseio.com",
    projectId: "playback-2a438",
    storageBucket: "playback-2a438.appspot.com",
};

firebase.initializeApp(config);


export default firebase;