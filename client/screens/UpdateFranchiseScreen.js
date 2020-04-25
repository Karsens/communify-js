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
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

import { withGlobalContext } from "../GlobalContext";

import Button from "../components/Button";
import STYLE from "../Style";
import Constants from "../Constants";
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Update your franchise" });

    this.state = {
      image: props.global.franchise?.image,
      hasEdited: false,
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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      if (!result.cancelled) {
        this.setState({
          hasEdited: true,
          image:
            Platform.OS === "web"
              ? result.uri
              : "data:image/png;base64," + result.base64,
        });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  render() {
    const { navigation, global } = this.props;
    const { response, loading, image, hasEdited } = this.state;

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

          <Button
            loading={loading}
            title="Update"
            onPress={() => {
              this.setState({ response: "", loading: true });
              const url = `${Constants.SERVER_ADDR}/updateFranchise`;
              fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  image,
                  loginToken: global.device?.loginToken,
                }),
              })
                .then((response) => response.json())
                .then(async ({ response }) => {
                  this.setState({ response, loading: false });
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

export default withGlobalContext(LoginScreen);
