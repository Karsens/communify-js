import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { withGlobalContext } from "../GlobalContext";

import ImageInput from "../components/ImageInput";
import Button from "../components/Button";
import STYLE from "../Style";
import Constants from "../Constants";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Signup" });

    this.state = {
      email: "",
      password: "",
      password2: "",
      username: "",
    };
  }

  render() {
    const { navigation, global } = this.props;
    const {
      username,
      email,
      password,
      password2,
      image,
      response,
      loading,
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
                const url = `${Constants.SERVER_ADDR}/signup`;
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
                    image,
                    fid: global.franchise?.id,
                  }),
                })
                  .then((response) => response.json())
                  .then(({ response, loginToken }) => {
                    this.setState({ response, loading: false });

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

export default withGlobalContext(SignupScreen);
