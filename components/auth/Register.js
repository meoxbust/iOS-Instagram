import React, {Component} from "react";
import {View, Button, Text, TextInput, Image, Pressable, TouchableOpacity} from "react-native";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {auth, db} from "../config/firebaseConfig"
import { doc, getDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import firebase from "firebase/compat";
import styles from "./style"
export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: "",
        };
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const {email, password, name} = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    }).then(() => console.log("successful"))
            })
    }

    render() {
        return (
            <View>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/insta-icon.png")}
                    style={{ height: 140, width: 140 }}
                  />
                  <Image
                    source={require("../../assets/Instagram.png")}
                    style={{ height: 60, width: 200 }}
                />
            </View>
                <TextInput
                  style={[styles.input, {marginTop: 20,marginLeft: 20,width: 350}]}
                    placeholder="Name"
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput
                  style={[styles.input, {marginLeft: 20,width: 350}]}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    style={[styles.input, {marginLeft: 20,width: 350}]}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                />
                   
                   <TouchableOpacity 
                    style={[styles.BUTTON, {margin: 22}]}
                    onPress={() => {
                        this.onSignUp()
                    }}
                    >
                    <Text style={styles.btntitle}>Sign Up</Text>
               </TouchableOpacity>
            </View>
        );
    }
}
export default Register;
