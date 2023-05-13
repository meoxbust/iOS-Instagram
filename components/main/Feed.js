import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
require("firebase/compat/firestore")
import Icon from 'react-native-vector-icons/FontAwesome';

function Feed(props){
    const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => {
    setIsLiked(!isLiked);
    Icon 
  };
  
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
                            <View style = {styles.row}>
                                <Image style={{ width: 20, height: 20 ,marginLeft:10 ,marginRight: 10}} resizeMode="contain" source={require('../../assets/Avatar.png')} />  
                                <Text style={styles.UserName}>{item.user.name}</Text>
                            </View>
                                <Text style={styles.Caption}>  {item.caption}</Text>
                                <Image style={styles.image} source={{uri: item.downloadUrl}}/>  
                            <View style = {styles.row}>           
                            {item.currentUserLike ?
                                (
                                    <Icon
                                        name = {'heart'}
                                        size = {30}
                                        color = 'red'
                                        marginLeft = {10}
                                        onPress={() => onDislikePress(item.user.uid, item.id)}
                                    />
                                )
                                :
                                (
                                    <Icon
                                       name  = {'heart-o'}
                                       size={30}
                                       color = 'black'
                                       marginLeft = {10}
                                        onPress={() => onLikePress(item.user.uid, item.id)}
                                    />
                                )
                            }
                             <Text style={{marginLeft: 5, fontSize: 20, color: 'red', fontWeight: 'bold'}}>{item.likesCount} </Text>
                            <View style = {styles.Icon}>
                              <TouchableOpacity  onPress={() => {
                                    props.navigation.navigate("Comment", {postId: item.id, uid: item.user.uid})
                                }}>
                                <Icon name="comment-o" size={30} color="black"  />
                            </TouchableOpacity>
                            </View>
                            </View> 
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
        marginTop: 20
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 2
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    UserName:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'darkgreen'
    },
    Heart:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#900',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    Caption: {
        marginLeft: 10,
        marginTop: 2,
        marginBottom: 10,
        fontSize: 20
    },
    Icon: {
        marginLeft: 10,
        marginRight: 10
    }
})