import React, {useState} from "react";
import {Button, Image, TextInput, View,TouchableOpacity, Text} from "react-native";
import firebase from "firebase/compat";
import {NavigationContainer} from "@react-navigation/native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchUserPosts} from "../../redux/actions";
import styles from "../auth/style";
import Icon from 'react-native-vector-icons/FontAwesome';
require("firebase/compat/firestore")
require("firebase/compat/storage")
export function Save(props, {navigation}){
    const imageUrl = props.route.params.imageTaken;
    const [caption, setCaption] = useState("");
    const uploadImage = async () => {
        const response = await fetch(imageUrl);
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const blob = await response.blob();
        const task = firebase.storage()
            .ref()
            .child(childPath)
            .put(blob);
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = snapshot => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
            })
        }
        const taskError = snapshot => {
            console.log(snapshot);
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadUrl) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadUrl,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                likesCount: 0,
        }).then((function (){
            props.fetchUserPosts();
            props.navigation.popToTop();
        }))
    }
    return (
        <View style={{flex: 1}}>
            <Image source={{uri: imageUrl}} style={{flex: 1}} />
            <View style = {{flexDirection: 'row', alignItems: 'center'}} >
            <TextInput
                style ={[{ marginLeft: 10,marginBottom: 10,marginTop: 10 , borderRadius: 10 ,borderWidth: 1, borderColor: 'black', height: 80,width: 330}]}
                placeholder={"Write a Caption..."}
                multiline = {true}
                onChangeText={(caption) => setCaption(caption)}
            />
             <TouchableOpacity                           
                            onPress={() =>  uploadImage()}
                            style={{width: 40, alignSelf: 'center'}}>
                            <Icon name="bookmark" marginLeft = {13} size={20} color="#900" />
                            <Text style={{marginLeft: 10,color: "bubble", fontWeight: 'bold', fontSize: 12}}>Send</Text>
            </TouchableOpacity>        
            </View>
        </View>
    )
}

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserPosts }, dispatch);
export default connect(null, mapDispatchProps)(Save);