import React, {useEffect, useState} from "react";
import firebase from "firebase/compat";
import {Button, FlatList, Text, TextInput, View, ScrollView, Image} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchUsersData} from "../../redux/actions";
import styles from "../../components/auth/style";
require("firebase/compat/firestore")
import Icon from 'react-native-vector-icons/FontAwesome';

export function Comment(props){
    const [arrowUp, setArrowUp] = React.useState(false) // <--- here
    const setShowAdvanceProfile = () => {}
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
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{ marginLeft: 10, marginTop: 15, width: 18, height: 18 }} resizeMode="contain" source={require('../../assets/Avatar.png')} />  
                        {item.user !== undefined ? (
                            <Text style = {{fontWeight: 'bold', fontSize: 16, marginLeft: 10, marginTop: 20, backgroundColor:'#e6e9ed' }}> 
                            {item.user.name} :</Text> 
                            ): null}        
                        <Text style = {{ marginLeft: 5, marginTop: 20}}>{item.text}</Text>
                    </View>
                )}
            />          
            <View style={{ flexDirection: 'row', alignItems: 'center' , }}>
                <Icon name="rocket" size={24} color="#900" style={{ marginRight: 8 }} />
                <TextInput 
                mutiline = {true}
                style={{width:250, backgroundColor: "#FFFFFF" , height: 40,           
                margin: 10,
                padding: 10,
                paddingTop: 10,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10
                } }
                placeholder= {"Write comment...."} 
                onChangeText={(text) => setText(text)} />
                 <Button 
                    styles = {styles.buttonsend}
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