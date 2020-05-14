import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";
import Separator from "../components/Separator";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";

class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 26 }}>Tribe ABC</Text>
        <Text>description</Text>

        <Separator />
      </View>
    );
  }
}

ActivitiesScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default withGlobalContext(ActivitiesScreen);
