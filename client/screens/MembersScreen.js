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
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
    };
  }

  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers = () => {
    fetch(`${Constants.SERVER_ADDR}/members?fid=${Constants.FRANCHISE.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((members) => {
        this.setState({ members });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { members } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={members}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("profile", { username: item.username })
                }
              >
                <View>
                  <Text>User:{item?.username}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default withGlobalContext(HomeScreen);
