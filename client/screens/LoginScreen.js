import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import Constants from "../Constants";
class LoginScreen extends React.Component {
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
            value={email}
            placeholder="Email"
            onChangeText={(email) => this.setState({ email })}
          />

          <TextInput
            style={STYLE.textInput}
            value={password}
            placeholder="Password"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />

          <Button
            title="Login"
            onPress={() => {
              const url = `${Constants.SERVER_ADDR}/login`;
              fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  password,
                  fid: global.franchise?.id,
                }),
              })
                .then((response) => response.json())
                .then(({ response, loginToken }) => {
                  this.setState({ response });

                  if (loginToken) {
                    global.dispatch({ type: "SET_LOGGED", value: true });
                    global.dispatch({
                      type: "SET_LOGIN_TOKEN",
                      value: loginToken,
                    });
                  }
                })
                .catch((error) => {
                  console.log(error, url);
                });
            }}
          />
          <Button
            title="Forgot password?"
            onPress={() => navigation.navigate("forgotPassword")}
          />
          <Button
            title="Sign up"
            onPress={() => navigation.navigate("signup")}
          />

          {__DEV__ ? (
            <Button
              title="Admin"
              onPress={() => navigation.navigate("adminFranchise")}
            />
          ) : null}
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

export default withGlobalContext(LoginScreen);
