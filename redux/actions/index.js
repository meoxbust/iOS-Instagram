import { USER_STATE_CHANGE } from "../constants";
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
                    dispatch({ type: USER_STATE_CHANGE, currentUser: { uid, ...userData } });
                } else {
                    console.log("User does not exist");
                }
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    };
}
