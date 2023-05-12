import React, {useState} from "react";
import {FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import firebase from "firebase/compat";
import styles from "../../components/auth/style";
require("firebase/compat/firestore")
require("firebase/compat/storage")
import Icon from 'react-native-vector-icons/FontAwesome';
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
                setUsers(users)
            })
    }
    return (
        <SafeAreaView style={{padding: 10}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="search" size={24} color="#900" style={{ marginRight: 8 }} />
                <TextInput 
                style={{width:300, backgroundColor: "#FFFFF F" , height: 40,
               
                margin: 10,
                padding: 10,
                paddingTop: 10,
                }}
                placeholder= {"Search name...."} 
                onChangeText={(search) => fetchUsers(search)} />
            </View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}  >
                        <ScrollView style ={styles.scrollView}>
                        <Text style = {styles.text}>
                            {item.name}
                        </Text>
                        </ScrollView>
                    </TouchableOpacity>
                )}/>
        </SafeAreaView>
    )
}