import React from "react";
import {Text, View, StyleSheet, FlatList, Image} from "react-native";
import {connect} from "react-redux";
function Profile(props){
    const {currentUser, posts} = props;
    console.log("Posts Profile", posts)
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{currentUser.name}</Text>
                <Text>{currentUser.email}</Text>
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={posts}
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
        marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImages: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1
    },

})