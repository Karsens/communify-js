import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ImageInput from "../components/ImageInput";
import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import Constants from "../Constants";

class UpdateProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Update profile" });

    this.state = {
      name: props.global.me?.name,
      bio: props.global.me?.bio,
      image: props.global.me?.image,
    };
  }

  render() {
    const { navigation, global } = this.props;
    const { image, name, bio, response, hasEdited } = this.state;

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
            value={name}
            placeholder="Name"
            onChangeText={(name) => this.setState({ name })}
          />

          <TextInput
            style={[STYLE.textInput, { height: 200 }]}
            numberOfLines={4}
            multiline
            value={bio}
            placeholder="Tell something about yourself"
            onChangeText={(bio) => this.setState({ bio })}
          />

          <Button
            title="Update"
            onPress={() => {
              const url = `${Constants.SERVER_ADDR}/updateProfile`;
              fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  loginToken: global.device.loginToken,
                  image: hasEdited ? image : undefined,
                  name,
                  bio,
                }),
              })
                .then((response) => response.json())
                .then(({ response, loginToken }) => {
                  this.setState({ response });
                  global.reloadMe(global.device.loginToken);
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
