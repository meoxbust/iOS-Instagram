import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
function Feed(props){
    const [posts, setPosts] = useState([])
    useEffect(() => {
        // let posts = [];
        if (props.usersFollowingLoaded === (props.following.length ?? 0)) {
            // for(let i = 0; i<props.following.length; i++)
            // {
            //     const user = props.users.find(el => el.uid === props.following[i])
            //     if(user !== undefined) {
            //         posts = [...posts, ...user.posts]
            //     }
            // }
            props.feed.sort((x, y) => {
                return x.creation - y.creation;
            })
            setPosts(props.feed)
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
        
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(1)})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(-1)})
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerImages}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image style={styles.image} source={{uri: item.downloadUrl}}/>
                            <Text style={styles.container}>{item.likesCount ? item.likesCount : 0} likes</Text>
                            {item.currentUserLike ?
                                (
                                    <Button
                                        title={"Dislike"}
                                        onPress={() => onDislikePress(item.user.uid, item.id)}
                                    />
                                )
                                :
                                (
                                    <Button
                                        title={"Like"}
                                        onPress={() => onLikePress(item.user.uid, item.id)}
                                    />
                                )
                            }
                            <Text style={styles.container}>{item.user.name}: {item.caption}</Text>
                            <Text
                                onPress={() => {
                                    props.navigation.navigate("Comment", {postId: item.id, uid: item.user.uid})
                                }}
                            >
                                View comments...
                            </Text>
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
    following: store.userState.following,
    // users: store.usersState.users,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed);

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
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 2
    },
})