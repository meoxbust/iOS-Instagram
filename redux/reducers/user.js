import {USER_FOLLOWING_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_CHATS_STATE_CHANGE, USER_STATE_CHANGE, CLEAR_DATA} from "../constants";

const initialState = {
    currentUser: null,
    posts: [],
    chats: [],
    following: [],
}

export const user = (state = initialState, action) => {
    switch (action.type){
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_CHATS_STATE_CHANGE:
            return {
                ...state,
                chats: action.chats
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
}