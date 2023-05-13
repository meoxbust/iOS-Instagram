import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, FlatList, Image, Button, ImageBackground, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import firebase from "firebase/compat";
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    }, [props.route.params.uid, props.following, props.posts])
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

    const onLogout = () => {
        firebase.auth().signOut();
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
            <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImage}
                source={{ uri: 'https://i.pinimg.com/236x/97/c5/4a/97c54ace3dbd45c7d9dd53f4696d7b3f.jpg' }}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: 'https://i.pinimg.com/564x/8f/86/7b/8f867b22e5ca0b8e6d0d283ac62c3927.jpg' }}
                    />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>{user.email}</Text>
                </View>
            </ImageBackground>

            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>102</Text>
                    <Text style={styles.statTitle}>Following</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>502</Text>
                    <Text style={styles.statTitle}>Followers</Text>
                </View>
            </View>
            <View style={styles.tweetsContainer}>
                <FlatList
                    data={[
                        { id: '1', text: 'Hello World!', time: '2h ago', countheart: '100', countcomment:'1' },
                        { id: '2', text: 'This is a tweet', time: '4h ago', countheart: '120', countcomment:'12' },
                        { id: '3', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla justo a tellus consequat consequat. Donec hendrerit, nisl in varius pharetra, augue quam blandit nisi, eu ullamcorper risus neque nec nulla.', time: '6h ago', countheart: '10', countcomment:'5' },
                        { id: '4', text: 'Another tweet here', time: '12h ago', countheart: '50' , countcomment:'52'},
                        { id: '5', text: 'The last tweet', time: '2d ago', countheart: '11', countcomment:'2' },
                    ]}
                    renderItem={({ item }) => (
                        <View style={styles.tweet}>
                            <Text style={styles.tweetTimestamp}>{item.time}</Text>
                            <Text style={styles.tweetText}>{item.text}</Text>
                            <View style={styles.tweetFooter}>
                                <Ionicons name='heart-outline' size={20} color='#000' />
                                <Text style={styles.tweetTimestamp}> {item.countheart}           </Text>
                                <Ionicons name='chatbox-ellipses-outline' size={20} color='#000'/>
                                <Text style={styles.tweetTimestamp}> {item.countcomment}</Text>
                                
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
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
                            <Button
                                title={"Message"}
                                onPress={() => {
                                    props.navigation.navigate("Chat", {user: user, uid: props.route.params.uid})
                                }}
                            />
                        </View>
                    ) :
                        <View>
                            <Button
                                title={"Chat"}
                                onPress={() => {
                                    props.navigation.navigate("ChatList")
                                }}
                            />
                            <Button
                                style = {styles.btlogout}
                                title={"Logout"}
                                onPress={() => onLogout()}
                            />
                        </View>
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
        alignItems: 'center',
        justifyContent: 'center',
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: 225,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        borderRadius: 50,
    },
    header: {
        flex: 1,
        justifyContent: 'center',      
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 50,
    },
    avatar: {
        width: 125,
        height: 125,
        marginTop: 20,
        left: 120,
        alignItems: 'center',
        borderRadius: 62.5,

    },
    name: {
        alignItems: 'center',
        justifyContent: 'center',
        left: 120,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
    username: {
        alignItems: 'center',
        justifyContent: 'center',
        left: 120,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    statTitle: {
        fontSize: 16,
        color: '#000',
    },
    tweetsContainer: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    tweet: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    tweetText: {
        fontSize: 16,
        color: '#000',
    },
    tweetFooter:{
        flexDirection: 'row',
        alignItems: 'center',
    },
})