import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import OTPInputView from "@twotalltotems/react-native-otp-input";

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
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Please fill in the code you got from your tribe-leader
        </Text>
        <OTPInputView
          style={{ width: "100%", height: 200 }}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.primary,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    color: "#000",
  },

  underlineStyleHighLighted: {
    borderColor: "#000",
  },
});

export default withGlobalContext(HomeScreen);
