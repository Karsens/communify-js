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
const { width } = Dimensions.get("window");
const isBigDevice = width > 500;

import Button from "../components/Button";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
class PostsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      isFetching: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.params?.reload !== this.props.route.params?.reload) {
      this.fetchPosts();
    }
  }

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = () => {
    const { global } = this.props;
    fetch(`${Constants.SERVER_ADDR}/posts?fid=${global.franchise?.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        this.setState({ posts, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchPosts();
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
            navigation.navigate("profile", { username: item.user.username })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <Image
              source={{ uri: Constants.SERVER_ADDR + item.user.thumbnail }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text>{item.user.username}</Text>
              <Text>{moment(item.createdAt).format("DD-MM-YYYY HH:mm")}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
          <Text>{item?.post}</Text>
        </View>
        {item.image ? (
          <Image
            source={{
              uri: Constants.SERVER_ADDR + item.image,
            }}
            style={{ width: maxWidth, height: maxWidth }}
          />
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate("post", { pid: item.id })}
        >
          <View>
            <Text>Comments: {item.numComments}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { posts } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => (
            <Button
              title="Create new post"
              onPress={() => navigation.navigate("createPost")}
            />
          )}
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

export default withGlobalContext(PostsScreen);
