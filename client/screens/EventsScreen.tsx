import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import { RefreshControl } from "react-native-web-refresh-control";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import Separator from "../components/Separator";
import Button from "../components/Button";

class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      isFetching: false,
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.params?.reload !== this.props.route.params?.reload) {
      this.fetchEvents();
    }
  }

  fetchEvents = () => {
    const { global } = this.props;
    this.setState({ isFetching: true });
    fetch(`${Constants.SERVER_ADDR}/events?fid=${global.franchise?.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((events) => {
        this.setState({ events, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    return (
      <View
        style={{
          alignItems: "center",
          marginVertical: 10,
          marginHorizontal: 20,
          borderWidth: 1,
          borderColor: "#CCC",
          borderRadius: 20,
        }}
      >
        {item.image ? (
          <Image
            source={{
              uri: Constants.SERVER_ADDR + item.image,
            }}
            style={{ width: 200, height: 200 }}
          />
        ) : null}
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {item?.title}
          </Text>
          <Text>{item?.message}</Text>
          <Text>{moment(item?.date).format("DD-MM-YYYY HH:mm")}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { events } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={events}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.fetchEvents}
            />
          }
          ListFooterComponent={
            <View>
              <Button
                title="Create new activity"
                onPress={() => navigation.navigate("createEvent")}
              />
            </View>
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
  },
});

export default withGlobalContext(ActivitiesScreen);
