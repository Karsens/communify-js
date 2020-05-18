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
  SafeAreaView,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import Separator from "../components/Separator";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import SelectTribe from "../components/SelectTribe";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelsubs: [],
      isFetching: true,
    };

    props.navigation.setOptions({
      title: "",
      headerLeft: () => <Text style={{ fontSize: 24 }}>Chats</Text>,
      headerRight: SelectTribe,
    });
  }

  componentDidMount() {
    this.fetchChannelsubs();
  }

  fetchChannelsubs = () => {
    const { global } = this.props;
    fetch(
      `${Constants.SERVER_ADDR}/channelsubs?loginToken=${global.device.loginToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((channelsubs) => {
        if (channelsubs.response) {
          this.setState({ response: channelsubs.response });
        } else {
          this.setState({ channelsubs });
        }
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchChannelsubs();
    });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("chat", { id: item.channel.id })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#CCC",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="ios-people" color="white" size={32} />
          </View>
          {item.unread > 0 ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 40,
                width: 25,
                height: 25,
                borderRadius: 13,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{item.unread}</Text>
            </View>
          ) : null}

          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{item.channel.name}</Text>
            {item.lastmessage ? <Text>{item.lastmessage}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { global, navigation } = this.props;
    const { channelsubs } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={channelsubs}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <Separator />}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default withGlobalContext(ChatScreen);
