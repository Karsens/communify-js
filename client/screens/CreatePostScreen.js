import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Platform,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ImageInput from "../components/ImageInput";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import Constants from "../Constants";

class UpdateProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Create post" });

    this.state = {
      message: "",
      image: null,
    };
  }

  render() {
    const { navigation, global } = this.props;
    const { image, message, response, hasEdited } = this.state;

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
            style={[STYLE.textInput, { height: 200 }]}
            numberOfLines={4}
            multiline
            value={message}
            placeholder="Message"
            onChangeText={(message) => this.setState({ message })}
          />

          <Button
            title="Create"
            onPress={() => {
              const url = `${Constants.SERVER_ADDR}/post`;
              fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  loginToken: global.device.loginToken,
                  image: hasEdited ? image : undefined,
                  message,
                }),
              })
                .then((response) => response.json())
                .then(({ response, success, pid }) => {
                  this.setState({ response });
                  if (success) {
                    navigation.navigate("posts", { reload: pid });
                  }
                })
                .catch((error) => {
                  console.log(error, url);
                });
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

export default withGlobalContext(UpdateProfileScreen);
