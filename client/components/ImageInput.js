import * as React from "react";
import { Image, TouchableOpacity, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";
import Constants from "../Constants";
class ImageInput extends React.Component {
  state = { hasEdited: false };
  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    await this.getPermissionAsync();

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      const base64 =
        Platform.OS === "web"
          ? result.uri
          : "data:image/png;base64," + result.base64;

      const manipulated = await ImageManipulator.manipulateAsync(
        base64,
        [{ resize: { width: 500, height: 500 } }],
        {
          format: ImageManipulator.SaveFormat.PNG,
        }
      );

      if (!result.cancelled) {
        this.props.onChange(manipulated.base64);
        this.setState({ hasEdited: true });
      }
    } catch (E) {
      console.log(E);
    }
  };

  render() {
    const { hasEdited } = this.state;
    const { value, small } = this.props;

    console.log("value", value);
    const SIZE = small ? 40 : 200;
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={this._pickImage}>
          {value ? (
            <Image
              source={{
                uri: hasEdited ? value : Constants.SERVER_ADDR + value,
              }}
              style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
            />
          ) : (
            <View
              style={{
                borderRadius: SIZE / 2,
                borderWidth: 2,
                borderColor: "#CCC",
                width: SIZE,
                height: SIZE,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImageInput;
