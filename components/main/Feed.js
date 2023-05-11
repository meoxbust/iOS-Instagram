import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image} from "react-native";
import {connect} from "react-redux";
require("firebase/compat/firestore")
function Feed(props){
    const [posts, setPosts] = useState([])
    useEffect(() => {
        let posts = [];
        if (props.usersFollowingLoaded === (props.following.length ?? 0)) {
            for(let i = 0; i<props.following.length; i++)
            {
                const user = props.users.find(el => el.uid === props.following[i])
                if(user !== undefined) {
                    posts = [...posts, ...user.posts]
                }
            }
            posts.sort((x, y) => {
                return x.creation - y.creation;
            })
            setPosts(posts)
        }
    }, [props.usersFollowingLoaded])
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
    users: store.usersState.users,
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