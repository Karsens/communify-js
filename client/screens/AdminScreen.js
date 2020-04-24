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
      {me?.level === 10 || __DEV__ ? (
        <OptionButton
          icon="ios-color-wand"
          label="Franchises"
          onPress={() => {
            navigation.navigate("adminFranchise");
          }}
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
