import * as React from "react";
import { Platform, StatusBar, UIManager, View } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import ExpoConstants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { PersistGate } from "redux-persist/es/integration/react";
import { connect, Provider } from "react-redux";
import { Helmet } from "react-helmet";

import useLinking from "./navigation/useLinking";
import { GlobalContextProvider } from "./GlobalContext";
import ErrorBoundary from "./ErrorBoundary";
import { persistor, store } from "./Store";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import Constants from "./Constants";

import CreatePostScreen from "./screens/CreatePostScreen";
import CreateTribeScreen from "./screens/CreateTribeScreen";
import CreateFolderItemScreen from "./screens/CreateFolderItemScreen";
import PostScreen from "./screens/PostScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SignupFranchiseScreen from "./screens/SignupFranchiseScreen";
import AdminFranchiseScreen from "./screens/AdminFranchiseScreen";
import AdminScreen from "./screens/AdminScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import UpdateFranchiseScreen from "./screens/UpdateFranchiseScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TribeScreen from "./screens/TribeScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createStackNavigator();

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
// patchFlatListProps();

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
          subway: require("./assets/fonts/Subway-Black.ttf"),
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
    const initialRouteName = "app";

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {Platform.OS === "web" ? (
          <Helmet>
            <title>{global.franchise?.name}</title>
            <meta name="description" content={global.franchise?.description} />
          </Helmet>
        ) : null}
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer
          ref={containerRef}
          initialState={initialNavigationState}
        >
          <Stack.Navigator initialRouteName={initialRouteName}>
            {/* home is always available */}
            <Stack.Screen name="create" component={SignupFranchiseScreen} />

            <Stack.Screen
              name="notFound"
              options={{ header: () => null }}
              component={NotFoundScreen}
            />

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

            <>
              <Stack.Screen
                name="app"
                component={BottomTabNavigator}
                options={{ title: "Home", header: () => null }}
              />

              <Stack.Screen name="createTribe" component={CreateTribeScreen} />

              <Stack.Screen
                name="createFolderItem"
                component={CreateFolderItemScreen}
              />
              <Stack.Screen name="createPost" component={CreatePostScreen} />
              <Stack.Screen name="post" component={PostScreen} />

              <Stack.Screen
                name="adminFranchise"
                component={AdminFranchiseScreen}
              />
              <Stack.Screen name="admin" component={AdminScreen} />
              <Stack.Screen name="profile" component={ProfileScreen} />
              <Stack.Screen name="tribe" component={TribeScreen} />
              <Stack.Screen name="settings" component={SettingsScreen} />
              <Stack.Screen
                name="updateProfile"
                component={UpdateProfileScreen}
              />
              <Stack.Screen
                name="updateFranchise"
                component={UpdateFranchiseScreen}
              />
              <Stack.Screen
                name="changePassword"
                component={ChangePasswordScreen}
              />
            </>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

class _RootContainer extends React.Component {
  componentDidMount() {
    const { device, reloadMe, reloadFranchise, dispatch } = this.props;

    reloadMe(device.loginToken);

    let slug = ExpoConstants.manifest.extra.franchise.slug;
    let domain = undefined;
    if (Platform.OS === "web") {
      const hostname = window.location.hostname.split(".");

      if (hostname[0] !== "localhost") {
        slug = hostname[0];
      }
    }

    console.log("slug", slug);

    reloadFranchise(slug);
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

const mapStateToProps = ({ device, me, franchise }) => {
  //console.log("State gets mapped to props... device only");
  return { device, me, franchise };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) =>
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } }),
  reloadFranchise: (slug) =>
    dispatch({ type: "FRANCHISE_FETCH_REQUESTED", payload: { slug } }),
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
