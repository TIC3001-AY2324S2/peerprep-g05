import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBx2wZ3DBbc-G6Y0ViTnj-8Y-wT72f24_k",
    authDomain: "peerprep-d86c6.firebaseapp.com",
    projectId: "peerprep-d86c6",
    storageBucket: "peerprep-d86c6.appspot.com",
    messagingSenderId: "214418593231",
    appId: "1:214418593231:web:0f19328f5469d7b88baeba",
    measurementId: "G-W2VBCM60T7",
    databaseURL: "https://peerprep-d86c6-default-rtdb.asia-southeast1.firebasedatabase.app"
};
firebase.initializeApp(firebaseConfig);
window.firebase = firebase;
export default firebase;