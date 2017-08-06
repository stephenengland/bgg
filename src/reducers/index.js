import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import collection from "./collection";
import user from "./user";

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  collection: collection,
  user: user
});
