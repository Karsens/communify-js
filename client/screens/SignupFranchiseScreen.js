import * as React from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  View,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ImageInput from "../components/ImageInput";

import { withGlobalContext } from "../GlobalContext";

import Button from "../components/Button";
import STYLE from "../Style";
import Constants from "../Constants";
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Create your app" });

    this.state = {
      franchise: "",
      username: "",
      email: "",
      password: "",
      password2: "",
      image: null,
    };
  }
  render() {
    const { navigation, global } = this.props;
    const {
      franchise,
      username,
      email,
      password,
      password2,
      response,
      loading,
      image,
    } = this.state;

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

          <ImageInput
            value={image}
            onChange={(base64) =>
              this.setState({
                hasEdited: true,
                image: base64,
              })
            }
          />

          <TextInput
            style={STYLE.textInput}
            value={franchise}
            placeholder="App name"
            onChangeText={(franchise) => this.setState({ franchise })}
          />

          <TextInput
            style={STYLE.textInput}
            value={email}
            placeholder="Email"
            onChangeText={(email) => this.setState({ email })}
          />

          <TextInput
            style={STYLE.textInput}
            value={username}
            placeholder="Username"
            onChangeText={(username) => this.setState({ username })}
          />

          <TextInput
            style={STYLE.textInput}
            value={password}
            placeholder="Password"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />

          <TextInput
            style={STYLE.textInput}
            value={password2}
            placeholder="Confirm password"
            secureTextEntry
            onChangeText={(password2) => this.setState({ password2 })}
          />

          <Button
            loading={loading}
            title="Sign up"
            onPress={() => {
              if (password !== password2) {
                this.setState({
                  response: "Those passwords don't match",
                });
              } else {
                this.setState({ response: "", loading: true });
                const url = `${Constants.SERVER_ADDR}/signupFranchise`;
                fetch(url, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email,
                    password,
                    username,
                    franchise,
                    image,
                  }),
                })
                  .then((response) => response.json())
                  .then(async ({ response, loginToken, slug }) => {
                    this.setState({ response, loading: false });

                    if (loginToken) {
                      const host = window.location.host
                        .split(".")
                        .splice(0, 2)
                        .join(".");
                      Linking.openURL(`https://${slug}.${host}`);
                    }
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

export default withGlobalContext(LoginScreen);
