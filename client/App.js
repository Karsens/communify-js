import * as React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { PersistGate } from "redux-persist/es/integration/react";
import { connect, Provider } from "react-redux";

import useLinking from "./navigation/useLinking";
import { GlobalContextProvider } from "./GlobalContext";
import ErrorBoundary from "./ErrorBoundary";
import { persistor, store } from "./Store";

import BottomTabNavigator from "./navigation/BottomTabNavigator";

import WebHomeScreen from "./screens/WebHomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AdminFranchiseScreen from "./screens/AdminFranchiseScreen";
import AdminScreen from "./screens/AdminScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

function App({ global }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer
          ref={containerRef}
          initialState={initialNavigationState}
        >
          <Stack.Navigator
            initialRouteName={
              Platform.OS === "web"
                ? "home"
                : global.device.logged
                ? "app"
                : "login"
            }
          >
            <Stack.Screen name="app" component={BottomTabNavigator} />
            {!global.device.logged ? (
              <>
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="signup" component={SignupScreen} />
                <Stack.Screen
                  name="forgotPassword"
                  component={ForgotPasswordScreen}
                />
              </>
            ) : null}
            <Stack.Screen name="home" component={WebHomeScreen} />
            <Stack.Screen
              name="adminFranchise"
              component={AdminFranchiseScreen}
            />
            <Stack.Screen name="admin" component={AdminScreen} />
            <Stack.Screen name="profile" component={ProfileScreen} />
            <Stack.Screen name="settings" component={SettingsScreen} />
            <Stack.Screen
              name="updateProfile"
              component={UpdateProfileScreen}
            />
            <Stack.Screen
              name="changePassword"
              component={ChangePasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

class _RootContainer extends React.Component {
  componentDidMount() {
    const { device, reloadMe, dispatch } = this.props;

    let token = device.loginToken;

    reloadMe(token);
  }

  componentDidUpdate(prevProps) {
    const { reloadMe, device } = this.props;
    //if login or logout happens
    if (prevProps.device.logged !== this.props.device.logged) {
      reloadMe(device.loginToken);
    }
  }

  render() {
    const { props } = this;

    return (
      <GlobalContextProvider props={props}>
        <ActionSheetProvider>
          <App global={props} />
        </ActionSheetProvider>
      </GlobalContextProvider>
    );
  }
}

const mapStateToProps = ({ device, me }) => {
  //console.log("State gets mapped to props... device only");
  return { device, me };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) =>
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } }),
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_RootContainer);

export default class FullApp extends React.Component {
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <ErrorBoundary>
            <RootContainer />
          </ErrorBoundary>
        </Provider>
      </PersistGate>
    );
  }
}
