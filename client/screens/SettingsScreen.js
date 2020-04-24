import * as React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GlobalContext } from "../GlobalContext";
import OptionButton from "../components/OptionButton";

export default function LinksScreen({ navigation }) {
  const { dispatch, me } = React.useContext(GlobalContext);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <OptionButton
        icon="ios-contact"
        label="Update profile"
        onPress={() => {
          navigation.navigate("updateProfile");
        }}
      />

      <OptionButton
        icon="ios-flashlight"
        label="Change password"
        onPress={() => {
          navigation.navigate("changePassword");
        }}
        isLastOption
      />
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
