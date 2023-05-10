import React, {useState} from "react";
import {FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import firebase from "firebase/compat";

require("firebase/compat/firestore")
require("firebase/compat/storage")
export default function Search(props){
    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("users")
            .where("name", ">=", search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return  {
                        id, ...data
                    }
                })
                console.log(users)
                setUsers(users)
            })
    }
    return (
        <SafeAreaView style={{padding: 10}}>
            <TextInput
                placeholder={"Search name..."}
                onChangeText={(search) => fetchUsers(search)}/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}/>
        </SafeAreaView>
    )
}