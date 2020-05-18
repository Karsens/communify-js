import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import Colors from "../constants/Colors";

class HomeScreen extends React.Component {
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
          paddingTop: 30,
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 50 }}>
          <Text style={{ fontSize: 50 }}>👋 Welcome!</Text>

          <Text style={{ textAlign: "center" }}>
            Make lasting friendships by creating a group of backpackers to
            travel together with
          </Text>
        </View>
        <Button title="Login" onPress={() => navigation.navigate("login")} />
        <Button title="Sign up" onPress={() => navigation.navigate("signup")} />
      </View>
    );
  }
}

export default withGlobalContext(HomeScreen);
