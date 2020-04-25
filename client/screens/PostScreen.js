import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import { RefreshControl } from "react-native-web-refresh-control";
import moment from "moment";
import STYLE from "../Style";
const { width } = Dimensions.get("window");
const isBigDevice = width > 500;

import Button from "../components/Button";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import { Ionicons } from "@expo/vector-icons";
class PostsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: null,
      image: "",
      message: "",
      isFetching: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.params?.reload) {
      //this.fetchPosts();
    }
  }

  componentDidMount() {
    this.fetchPost();
    this.getPermissionAsync();
  }

  fetchPost = () => {
    const { global, route } = this.props;
    fetch(
      `${Constants.SERVER_ADDR}/getPost?fid=${global.franchise?.id}&id=${route.params?.pid}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((post) => {
        this.setState({ post, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchPost();
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
          <Text>{item?.comment}</Text>
        </View>
        {item.image ? (
          <Image
            source={{
              uri: Constants.SERVER_ADDR + item.image,
            }}
            style={{ width: maxWidth, height: maxWidth }}
          />
        ) : null}
      </View>
    );
  };

  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });

      if (!result.cancelled) {
        this.setState({
          image:
            Platform.OS === "web"
              ? result.uri
              : "data:image/png;base64," + result.base64,
          hasEdited: true,
        });
      }
    } catch (E) {
      console.log(E);
    }
  };

  renderHeader = () => {
    const item = this.state.post?.post;

    if (!item) return null;
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
      </View>
    );
  };

  renderFooter = () => {
    const { global, route } = this.props;
    const { image, message, hasEdited, response } = this.state;
    return global.device.logged ? (
      <View>
        <Text>New comment:</Text>
        <View style={{ height: 40 }}>
          <Text>{response}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={this._pickImage}>
            {image ? (
              <Image
                source={{
                  uri: hasEdited ? image : Constants.SERVER_ADDR + image,
                }}
                style={{ width: 50, height: 50 }}
              />
            ) : (
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#CCC",
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="md-camera" color="#CCC" size={30} />
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={[STYLE.textInput, { height: 100, flex: 1 }]}
            numberOfLines={4}
            multiline
            value={message}
            placeholder="Message"
            onChangeText={(message) => this.setState({ message })}
          />
        </View>

        <Button
          title="Comment"
          onPress={() => {
            const url = `${Constants.SERVER_ADDR}/comment`;
            fetch(url, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                loginToken: global.device.loginToken,
                image: hasEdited ? image : undefined,
                message,
                pid: route.params?.pid,
              }),
            })
              .then((response) => response.json())
              .then(({ response, success }) => {
                this.setState({ response });
                if (success) {
                  this.fetchPost();
                  this.setState({ message: "", image: null });
                }
              })
              .catch((error) => {
                console.log(error, url);
              });
          }}
        />
      </View>
    ) : (
      <Text>Login to comment</Text>
    );
  };
  render() {
    const { post } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          data={post?.comments}
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
