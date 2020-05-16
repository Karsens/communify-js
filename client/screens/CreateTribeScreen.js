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
import KeyboardAvoidingSpace from "../components/KeyboardAvoidingSpace";
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Create your tribe" });

    this.state = {
      tribe: "",
      tagline: "",
      bio: "",
      image: null,
    };
  }
  render() {
    const { navigation, global } = this.props;
    const { tribe, tagline, bio, image, response, loading } = this.state;

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
            value={tribe}
            placeholder="Tribe name"
            onChangeText={(tribe) => this.setState({ tribe })}
          />

          <TextInput
            style={STYLE.textInput}
            value={tagline}
            placeholder="Tagline"
            onChangeText={(tagline) => this.setState({ tagline })}
          />

          <TextInput
            style={STYLE.textInput}
            value={bio}
            placeholder="Bio"
            onChangeText={(bio) => this.setState({ bio })}
          />

          <Button
            loading={loading}
            title="Sign up"
            onPress={() => {
              if (!tribe) {
                this.setState({ response: "Tribe is required" });
              } else {
                this.setState({ response: "", loading: true });
                const url = `${Constants.SERVER_ADDR}/createTribe`;
                fetch(url, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    tribe,
                    tagline,
                    bio,
                    image,
                    loginToken: global.device.loginToken,
                  }),
                })
                  .then((response) => response.json())
                  .then(async ({ response }) => {
                    this.setState({ response, loading: false });
                  })
                  .catch((error) => {
                    console.log(error, url);
                  });
              }
            }}
          />
        </ScrollView>
        <KeyboardAvoidingSpace hasTabNav={false} />
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
