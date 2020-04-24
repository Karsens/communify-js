import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.fetchMember();
  }

  fetchMember = () => {
    const url = `${Constants.SERVER_ADDR}/profile?username=${this.props.route.params?.username}&fid=${Constants.FRANCHISE.id}`;
    console.log(url);
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
    return (
      <View style={styles.container}>
        <View>
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
