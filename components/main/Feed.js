import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
function Feed(props){
    const [posts, setPosts] = useState(props.feed.map(post => ({ ...post, likesCount: 0})))
    useEffect(() => {
        if (props.usersFollowingLoaded === (props.following.length ?? 0)) {
            props.feed.sort((x, y) => {
                return x.creation - y.creation;
            })
            setPosts(props.feed)
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = async (userId, postId) => {
        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
        
        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(1)})
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId && post.user.uid === userId) {
                    console.log(post.id ,"before add like: ",post.likesCount)
                    return {
                        ...post,
                        likesCount: post.likesCount + 1,
                        currentUserLike: true,
                    };
                }
                console.log("after add like: ",post.likesCount)
                return post;
            })
        );
    }
    const onDislikePress = async (userId, postId) => {
        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()

        await firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({"likesCount": firebase.firestore.FieldValue.increment(-1)});
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId && post.user.uid === userId) {
                    console.log(post.id ,"before dislike: ",post.likesCount)
                    return {
                        ...post,
                        likesCount: post.likesCount,
                        currentUserLike: false,
                    };
                }
                console.log("after dislike: ",post.likesCount)
                return post;
            })
        );
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
                            <Text style={styles.container}>{item.likesCount} likes</Text>
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