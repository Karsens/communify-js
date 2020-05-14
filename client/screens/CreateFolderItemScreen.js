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
import OptionsInput from "../components/OptionsInput";
import FileInput from "../components/FileInput";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import Constants from "../Constants";

class UpdateProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Create item" });

    this.state = {
      message: "",
      image: null,
    };
  }

  render() {
    const { navigation, global } = this.props;
    const { response, hasEdited, name, image, file, type, text } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingTop: 30,
          }}
        >
          <View style={{ height: 40 }}>
            <Text>{response}</Text>
          </View>

          <OptionsInput
            title="Type"
            options={[
              { key: "folder", label: "Folder" },
              { key: "youtube", label: "Youtube video" },
              { key: "mp3", label: "MP3" },
              { key: "image", label: "Image" },
              { key: "text", label: "Blogpost" },
            ]}
            onChange={(type) => this.setState({ type })}
            value={this.state.type}
          />

          <TextInput
            style={[STYLE.textInput]}
            value={name}
            placeholder="Name"
            onChangeText={(name) => this.setState({ name })}
          />

          <ImageInput
            value={image}
            onChange={(base64) =>
              this.setState({
                hasEdited: true,
                image: base64,
              })
            }
          />

          <FileInput
            title="Select file(s)"
            value={file}
            onChange={(file) => this.setState({ file })}
          />

          {type === "text" || type === "youtube" ? (
            <TextInput
              style={[STYLE.textInput]}
              value={text}
              placeholder={type === "text" ? "Blog text" : "Video URL"}
              onChangeText={(text) => this.setState({ text })}
            />
          ) : null}

          <Button
            title="Create"
            onPress={() => {
              const url = `${Constants.SERVER_ADDR}/createFolderItem`;
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
                  file,
                  type,
                  text,
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
