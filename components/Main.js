import React, {Component} from "react";
import {fetchUser, fetchUserPosts} from "../redux/actions/index";
import {Text, View} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import FeedScreen from "./main/Feed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./main/Profile";

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return  (
        <>
        </>
    )
}
export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName={"Feed"} labeled={false} activeColor={"#71717a"} inactiveColor={"#3f3f46"} barStyle={{ backgroundColor: '#f4f4f5' }}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"home-outline"} color={color} size={26}/>
                                )
                            }}
                />
                <Tab.Screen name="MainAdd" component={EmptyScreen}
                            listeners={({navigation}) => ({
                                tabPress: event => {
                                    event.preventDefault();
                                    navigation.navigate("Add");
                                }
                            })}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"plus-box-outline"} color={color} size={26}/>
                                )
                            }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                            options={{
                                tabBarIcon: ({color}) => (
                                    <MaterialCommunityIcons name={"account-outline"} color={color} size={26}/>
                                )
                            }}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);