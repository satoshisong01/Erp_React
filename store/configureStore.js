import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { tabsReducer } from "components/tabs/tabsReducer";

export const rootReducer = combineReducers({
  tabs: tabsReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk,
    )
  )
);

export default store;
