import {USER_FOLLOWING_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_STATE_CHANGE} from "../constants";
import firebase from "firebase/compat";

export function fetchUser() {
    return dispatch => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    const userData = docSnapshot.data();
                    dispatch({ type: USER_STATE_CHANGE, currentUser: { uid: firebase.auth().currentUser.uid, ...userData } });
                }
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    };
}

export function fetchUserPosts() {
    return dispatch => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
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

export function fetchUserFollowing() {
    return dispatch => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot(snapshot => {
                let following = snapshot.docs.map(doc => {
                    return doc.id;
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following })
            })
    };
}
