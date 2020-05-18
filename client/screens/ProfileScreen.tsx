import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    const isMe = props.route.params?.username === props.global.me?.username;

    props.navigation.setOptions({
      headerTitle: props.route.params?.username,
      headerRight: isMe
        ? () => (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("updateProfile")}
            >
              <Ionicons
                name="md-create"
                size={24}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          )
        : undefined,
    });
  }

  componentDidMount() {
    this.fetchMember();
  }

  fetchMember = () => {
    const { global } = this.props;
    const url = `${Constants.SERVER_ADDR}/profile?username=${this.props.route.params?.username}&fid=${global.franchise?.id}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((user) => {
        this.setState({ user });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { user } = this.state;
    const { navigation } = this.props;

    const uri = Constants.SERVER_ADDR + user?.image;
    return (
      <View style={styles.container}>
        <View>
          {user?.image ? (
            <Image
              source={{
                uri,
              }}
              style={{ width, height: 512, borderRadius: 24 }}
              resizeMode="contain"
            />
          ) : null}

          <Text>User:{user?.id.toString()}</Text>
        </View>
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

export default withGlobalContext(ProfileScreen);
