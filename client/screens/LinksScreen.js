import * as React from "react";
import { StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GlobalContext } from "../GlobalContext";
import OptionButton from "../components/OptionButton";

export default function LinksScreen({ navigation }) {
  const { dispatch, me, device } = React.useContext(GlobalContext);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {device.logged ? (
        <OptionButton
          icon="md-settings"
          label="Settings"
          onPress={() => {
            navigation.navigate("settings");
          }}
        />
      ) : (
        <>
          <OptionButton
            icon="ios-contact"
            label="Login"
            onPress={() => {
              navigation.navigate("login");
            }}
          />

          <OptionButton
            icon="ios-at"
            label="Sign up"
            onPress={() => {
              navigation.navigate("signup");
            }}
          />
        </>
      )}

      {me?.level === 10 || __DEV__ ? (
        <OptionButton
          icon="ios-color-wand"
          label="Admin"
          onPress={() => {
            navigation.navigate("admin");
          }}
        />
      ) : null}

      {device.logged ? (
        <OptionButton
          icon="ios-exit"
          label="Logout"
          onPress={async () => {
            await dispatch({ type: "SET_LOGGED", value: false });
            await dispatch({ type: "SET_LOGIN_TOKEN", value: null });
          }}
          isLastOption
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingTop: 15,
  },
});
