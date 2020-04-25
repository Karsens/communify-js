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
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

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

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      if (!result.cancelled) {
        this.setState({
          image:
            Platform.OS === "web"
              ? result.uri
              : "data:image/png;base64," + result.base64,
          hasEdited: true,
        });
      }
    } catch (E) {
      console.log(E);
    }
  };

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

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity onPress={this._pickImage}>
              {image ? (
                <Image
                  source={{
                    uri: hasEdited ? image : Constants.SERVER_ADDR + image,
                  }}
                  style={{ width: 200, height: 200, borderRadius: 100 }}
                />
              ) : (
                <View
                  style={{
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: "#CCC",
                    width: 200,
                    height: 200,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

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
