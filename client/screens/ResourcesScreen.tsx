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
import { RefreshControl } from "react-native-web-refresh-control";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isBigDevice = width > 500;

import Button from "../components/Button";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
class ResourcesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folder: [],
      isFetching: false,
    };
  }

  componentDidMount() {
    this.fetchFolder();
  }

  fetchFolder = () => {
    const parentId = this.props.route?.params?.parentId;
    const { global } = this.props;
    fetch(
      `${Constants.SERVER_ADDR}/folder?fid=${global.franchise?.id}&parentId=${parentId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((folder) => {
        this.setState({ folder, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchFolder();
    });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    const maxWidth = width > 500 ? 500 : width;
    return (
      <View
        style={{
          marginVertical: 5,
          paddingVertical: 5,

          backgroundColor: "#FFF",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("resources", { parentId: item.id })
          }
        >
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            {item.image ? (
              <Image
                source={{
                  uri: Constants.SERVER_ADDR + item.image,
                }}
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <Ionicons name="md-folder" size={40} />
            )}

            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { posts } = this.state;
    const { navigation, global } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() =>
            global.me?.level >= 5 || __DEV__ ? (
              <Button
                title="Create new"
                onPress={() => navigation.navigate("createFolderItem")}
              />
            ) : null
          }
          data={posts}
          renderItem={this.renderItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDD",
    paddingHorizontal: isBigDevice ? "20%" : 0,
  },
});

export default withGlobalContext(ResourcesScreen);
