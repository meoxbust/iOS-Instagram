import {USER_POST_STATE_CHANGE, USER_STATE_CHANGE} from "../constants";
import firebase from "firebase/compat";

export function fetchUser() {
    return dispatch => {
        const uid = firebase.auth().currentUser.uid;
        firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    const userData = docSnapshot.data();
                    dispatch({ type: USER_STATE_CHANGE, currentUser: { uid: uid, ...userData } });
                }
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    };
}

export function fetchUserPosts() {
    return dispatch => {
        const uid = firebase.auth().currentUser.uid;
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then(docSnapshot => {
                let posts = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return  {
                        id, ...data
                    }
                })
                dispatch({ type: USER_POST_STATE_CHANGE, posts: posts});
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    };
}