import React, {useEffect, useState} from "react";
import firebase from "firebase/compat";
import {Button, FlatList, Text, TextInput, View} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchUsersData} from "../../redux/actions";
require("firebase/compat/firestore")

export function Comment(props){
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    useEffect(() => {

        const matchUserToComment = (comments) => {
            for(let i = 0; i<comments.length; ++i)
            {
                if(comments[i].hasOwnProperty('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user === undefined)
                {
                    props.fetchUsersData(comments[i].creator, false)
                }
                else
                {
                    console.log("add user property!")
                    comments[i].user = user;
                }
            }
            setComments(comments)
        }

        if(props.route.params.postId !== postId)
        {
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection("comments")
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {
                            id, ...data,
                        }
                    })
                    matchUserToComment(comments);
                })
            setPostId(props.route.params.postId)
        }
        else{
            matchUserToComment(comments);
        }
    }, [props.route.params.postId, props.users])
    const onCommentSend = () => {
        const newComment = {
            creator: firebase.auth().currentUser.uid,
            text
        };
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(props.route.params.postId)
            .collection("comments")
            .add(newComment)
            .then(() => {
            setComments(prevComments => [...prevComments, {id: '', ...newComment}]);
            setText('');
        })}
    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ? (
                            <Text>{item.user.name}</Text>
                        ): null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    placeholder={"Write comment..."}
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => onCommentSend()}
                    title={"Send"}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment);