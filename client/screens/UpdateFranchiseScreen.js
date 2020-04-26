import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { withGlobalContext } from "../GlobalContext";

import Button from "../components/Button";
import Constants from "../Constants";
import ImageInput from "../components/ImageInput";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Update your franchise" });

    this.state = {
      image: props.global.franchise?.image,
      hasEdited: false,
    };
  }

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

          <ImageInput
            value={image}
            onChange={(base64) =>
              this.setState({
                hasEdited: true,
                image: base64,
              })
            }
          />

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
