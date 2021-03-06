import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_SUCCESS,
  USER_FOLLOW_FAIL,
  USER_UNFOLLOW_FAIL,
  USER_UNFOLLOW_SUCCESS,
  USER_UNFOLLOW_REQUEST,
  USER_GET_NOTIF_REQUEST,
  USER_GET_NOTIF_SUCCESS,
  USER_GET_NOTIF_FAIL,
  USER_ACCEPT_NOTIF_REQUEST,
  USER_ACCEPT_NOTIF_SUCCESS,
  USER_ACCEPT_NOTIF_FAIL,
  USER_DENIE_NOTIF_REQUEST,
  USER_DENIE_NOTIF_SUCCESS,
  USER_DENIE_NOTIF_FAIL,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userProfileReducer = (
  state = {
    user: { followers: [], following: [], notifications: [] },
    articles: [],
  },
  action,
) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { ...state, loading: true };
    case USER_PROFILE_SUCCESS:
      return {
        loading: false,
        user: action.payload.user,
        articles: action.payload.matches,
        userId: action.payload._id,
      };
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_PROFILE_RESET:
      return { user: {} };
    default:
      return state;
  }
};
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case USER_LIST_RESET:
      return { users: [] };
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userUpdateReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userFollowerReducer = (state = { user: {} }, action) => {
  // const newState = Object.assign({}, state);
  // console.log(newState);

  switch (action.type) {
    case USER_FOLLOW_REQUEST:
      return { loading: true, ...state };
    case USER_FOLLOW_SUCCESS:
      return {
        loading: false,
        ...state,
        success: true,
        following: action.payload,
      };
    case USER_FOLLOW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userUnFollowerReducer = (
  state = { user: { success: false } },
  action,
) => {
  switch (action.type) {
    case USER_UNFOLLOW_REQUEST:
      return { loading: true };
    case USER_UNFOLLOW_SUCCESS:
      return { loading: false, success: true };
    case USER_UNFOLLOW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userNotifReducer = (
  state = { user: {}, notifications: [] },
  action,
) => {
  switch (action.type) {
    case USER_GET_NOTIF_REQUEST:
      return { loading: true };
    case USER_GET_NOTIF_SUCCESS:
      return { loading: false, notifications: action.payload };
    case USER_GET_NOTIF_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userAcceptNotifReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_ACCEPT_NOTIF_REQUEST:
      return { loading: true };
    case USER_ACCEPT_NOTIF_SUCCESS:
      return { loading: false, success: true };
    case USER_ACCEPT_NOTIF_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDenieNotifReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DENIE_NOTIF_REQUEST:
      return { loading: true };
    case USER_DENIE_NOTIF_SUCCESS:
      return { loading: false, success: true };
    case USER_DENIE_NOTIF_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
