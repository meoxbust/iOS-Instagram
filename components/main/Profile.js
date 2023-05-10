import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
function Profile(props){
    const [userPosts, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    useEffect(() => {
        const {currentUser, posts} = props;
        console.log({currentUser, posts})
        if(props.route.params.uid === firebase.auth().currentUser.uid)
        {
            setUser(currentUser);
            setUserPost(posts);
        }else{
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        setUser(docSnapshot.data())
                    }
                })
                .catch(error => {
                    console.error("Error getting user document:", error);
                });

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
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
                    setUserPost(posts)
                })
                .catch(error => {
                    console.error("Error getting user document:", error);
                });
        }
    }, [props.route.params.uid])
    if(user === null)
    {
        return <></>
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                            <View style={styles.containerImages}>
                                <Image style={styles.image} source={{uri: item.downloadUrl}}/>
                            </View>
                        )
                    }
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImages: {
        flex: 1/3,
        marginLeft: -2,
        marginRight: -2,
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 2
    },

})