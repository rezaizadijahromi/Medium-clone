import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  articleListReducer,
  articleDetailReducer,
  articleClapReducer,
} from "./reducers/articlesReducer";

import {
  userLoginReducer,
  userProfileReducer,
  userRegisterReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
  userFollowerListReducer,
  userFollowerReducer,
} from "./reducers/userReducer";

const reducer = combineReducers({
  articleList: articleListReducer,
  articleDetail: articleDetailReducer,
  articleClap: articleClapReducer,
  userLogin: userLoginReducer,
  userProfile: userProfileReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userUpdate: userUpdateReducer,
  userFollower: userFollowerReducer,
  userFollowerList: userFollowerListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
