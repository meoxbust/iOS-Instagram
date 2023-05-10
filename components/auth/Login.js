import React, {useState} from "react";
import {View, Button, Text, TextInput} from "react-native";
import {container, form} from "../styles";
import firebase from "firebase/compat";

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => console.log("Sign in successfully!"))
    }
    return (
        <View style={container.center}>
            <View style={container.formCenter}>
                <TextInput
                    style={form.textInput}
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <Button
                    style={form.button}
                    onPress={() => onSignIn()}
                    title="Sign In"
                />
            </View>


            <View style={form.bottomButton}>
                <Text
                    title="Register"
                    onPress={() => props.navigation.navigate("Register")}>
                    Don't have an account? SignUp.
                </Text>
            </View>
        </View>
    )
}

