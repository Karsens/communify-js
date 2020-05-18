import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Button";
import Constants from "../Constants";
import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import { Global, Navigation } from "../Types";

interface Props {
  navigation: Navigation;
  global: Global;
}

class ChangePasswordScreen extends React.Component<Props> {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Change Password" });

    this.state = {
      passwordOld: "",
      password: "",
      password2: "",
    };
  }

  render() {
    const { navigation, global } = this.props;
    const { passwordOld, password, password2, response, loading } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingTop: 30,
            marginHorizontal: 20,
          }}
        >
          <View style={{ height: 40 }}>
            <Text>{response}</Text>
          </View>

          <TextInput
            style={STYLE.textInput}
            value={passwordOld}
            placeholder="Current password"
            secureTextEntry
            onChangeText={(passwordOld) => this.setState({ passwordOld })}
          />

          <TextInput
            style={STYLE.textInput}
            value={password}
            placeholder="New Password"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />

          <TextInput
            style={STYLE.textInput}
            value={password2}
            placeholder="Password again"
            secureTextEntry
            onChangeText={(password2) => this.setState({ password2 })}
          />

          <Button
            loading={loading}
            title="Change password"
            onPress={() => {
              if (password !== password2) {
                this.setState({
                  response: "Those passwords don't match",
                });
              } else {
                this.setState({ response: "", loading: true });
                const url = `${Constants.SERVER_ADDR}/changePassword`;
                fetch(url, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    passwordOld,
                    password,
                    token: global.device.loginToken,
                  }),
                })
                  .then((response) => response.json())
                  .then(({ response }) => {
                    console.log("response", response);
                    this.setState({ response, loading: false });
                  })
                  .catch((error) => {
                    console.log(error, url);
                  });
              }
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default withGlobalContext(ChangePasswordScreen);
