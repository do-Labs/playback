import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/firestore'
import { Base64 } from 'js-base64'

const firebaseConfig = JSON.parse(Base64.decode(process.env.REACT_APP_KEYS_B64));
firebase.initializeApp(firebaseConfig);

export default firebase;