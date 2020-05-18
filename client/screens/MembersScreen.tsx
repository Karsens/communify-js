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
import { RefreshControl } from "react-native-web-refresh-control";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
class MembersScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      isFetching: false,
    };
  }

  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers = () => {
    const { global } = this.props;
    fetch(`${Constants.SERVER_ADDR}/members?fid=${global.franchise?.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((members) => {
        this.setState({ members, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchMembers();
    });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("profile", { username: item.username })
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          {item.thumbnail ? (
            <Image
              source={{
                uri: Constants.SERVER_ADDR + item.thumbnail,
              }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#CCC",
                borderRadius: 24,
              }}
            />
          )}
          <View style={{ marginLeft: 20 }}>
            <Text>{item?.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { members } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={members}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => (
            <View
              style={{ backgroundColor: "#CCC", height: 0.5, width: "100%" }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

MembersScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default withGlobalContext(MembersScreen);
