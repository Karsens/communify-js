import { AsyncStorage, Platform } from "react-native";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import mySaga from "./Sagas";

type Device = {
  loginToken: string,
  logged: boolean,
};

const initDevice = {
  loginToken: "",
  logged: false,
};

const deviceReducer = (state: Device = initDevice, action) => {
  switch (action.type) {
    case "SET_LOGIN_TOKEN": {
      return { ...state, loginToken: action.value };
    }

    case "SET_LOGGED": {
      return { ...state, logged: action.value };
    }
    default:
      return state;
  }
};

const initMe = null;
const meReducer = (state = initMe, action) => {
  switch (action.type) {
    case "ME_FETCH_SUCCEEDED": {
      return action.me;
    }

    case "ME_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const initFranchise = null;
const franchiseReducer = (state = initMe, action) => {
  switch (action.type) {
    case "FRANCHISE_FETCH_SUCCEEDED": {
      return action.franchise;
    }

    case "FRANCHISE_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const config = {
  key: "v1",
  storage: AsyncStorage,
  whitelist: ["device", "me", "franchise"],
};

const sagaMiddleware = createSagaMiddleware();

const reducers = {
  device: deviceReducer,
  me: meReducer,
  franchise: franchiseReducer,
};

const rootReducer = persistCombineReducers(config, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
const persistor = persistStore(store);

sagaMiddleware.run(mySaga);

export { persistor, store };
