import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
function Profile(props){
    const [userPosts, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)
    useEffect(() => {
        const {currentUser, posts} = props;
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
        if(props.following.indexOf(props.route.params.uid) > -1){
            setFollowing(true)
        }else{
            setFollowing(false)
        }
    }, [props.route.params.uid, props.following])
    if(user === null)
    {
        return <></>
    }
    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({

            }).then(() => console.log("follow successfully"))
    }

    const onUnFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete().then(() => console.log("Unfollow successfully"))
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {
                    props.route.params.uid !== firebase.auth().currentUser.uid ? (
                        <View>
                            {
                                following ? (
                                    <Button
                                        title={"Followed"}
                                        onPress={() => onUnFollow()}
                                    />
                                ) : (
                                    <Button
                                        title={"Follow"}
                                        onPress={() => onFollow()}
                                    />
                                )
                            }
                        </View>
                    ) : null
                }
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
    posts: store.userState.posts,
    following: store.userState.following,
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