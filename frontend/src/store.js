import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  articleListReducer,
  articleDetailReducer,
  articleClapReducer,
} from "./reducers/articlesReducer";

const reducer = combineReducers({
  articleList: articleListReducer,
  articleDetail: articleDetailReducer,
  articleClap: articleClapReducer,
});
const initialState = {};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
