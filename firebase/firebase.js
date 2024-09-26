import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCFHBjqDXFirg-DIWNDGtOaQCss6GwOrMA",
    authDomain: "aora-f1e99.firebaseapp.com",
    projectId: "aora-f1e99",
    storageBucket: "aora-f1e99.appspot.com",
    messagingSenderId: "164534914745",
    appId: "1:164534914745:web:0549cc54b509e6d1721568",
    measurementId: "G-KHL1ZR1DP7"
};

if (!firebase?.apps?.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };

export const firebaseCollections = {
    videos: "videos",
};

export const firebaseStoragePath = {
    video: 'video',
    thumbnail: 'thumbnail'
}

export const getAllFeeds = async () => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection(firebaseCollections.videos).onSnapshot((querySnapshot) => {
            const { docs } = querySnapshot
            resolve(docs)
        }, (error) => {
            reject(error)
        })
    })
}