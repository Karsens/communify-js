import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import Colors from "../constants/Colors";

class WelcomeScreen extends React.Component {
  state = {
    password: "",
    email: "",
  };
  constructor(props) {
    super(props);
    props.navigation.setOptions({ headerTitle: global.franchise?.name });
  }

  render() {
    const { navigation, global } = this.props;
    const { email, password, response } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 50 }}>
          <Text style={{ fontSize: 50 }}>👋 Welcome!</Text>

          <Text>What do you want to do?</Text>
        </View>

        <Button
          title="Explore tribes and activities"
          onPress={() => navigation.navigate("explore")}
        />

        <Button
          title="Join a tribe with a code"
          onPress={() => navigation.navigate("joinTribe")}
        />

        <Button
          title="Create a new tribe"
          onPress={() => navigation.navigate("createTribe")}
        />
      </View>
    );
  }
}

export default withGlobalContext(WelcomeScreen);
