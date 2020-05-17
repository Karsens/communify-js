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
import KeyboardAvoidingSpace from "../components/KeyboardAvoidingSpace";

import Button from "../components/Button";

import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import Constants from "../Constants";
import DateTimeInput from "../components/DateTimeInput";

class UpdateProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Create new activity" });

    this.state = {
      message: "",
      image: null,
    };
  }

  submit = () => {
    const { navigation, global } = this.props;
    const { image, message, hasEdited, startDate, title } = this.state;

    const url = `${Constants.SERVER_ADDR}/createEvent`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginToken: global.device.loginToken,
        image: hasEdited ? image : undefined,
        title,
        message,
        date: startDate,
      }),
    })
      .then((response) => response.json())
      .then(({ response, success, eventId }) => {
        this.setState({ response });
        if (success) {
          navigation.navigate("events", { reload: eventId });
        }
      })
      .catch((error) => {
        console.log(error, url);
      });
  };

  render() {
    const { navigation, global } = this.props;
    const {
      image,
      title,
      message,
      response,
      hasEdited,
      startDate,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
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
            style={[STYLE.textInput]}
            value={title}
            placeholder="Title"
            onChangeText={(title) => this.setState({ title })}
          />

          <TextInput
            style={[STYLE.textInput, { height: 150 }]}
            numberOfLines={4}
            multiline
            value={message}
            placeholder="Message"
            onChangeText={(message) => this.setState({ message })}
          />

          <DateTimeInput
            title="Selecteer Datum"
            titleSelected="Datum"
            value={startDate}
            onChange={(startDate) => {
              this.setState({ startDate });
            }}
          />

          <Button title="Create" onPress={this.submit} />
        </ScrollView>
        <KeyboardAvoidingSpace />
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
