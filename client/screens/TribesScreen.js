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
  SafeAreaView,
} from "react-native";
import ExpoConstants from "expo-constants";
import TouchableScale from "react-native-touchable-scale";

import { RefreshControl } from "react-native-web-refresh-control";

const { width } = Dimensions.get("window");
const isBigDevice = width > 500;
const maxWidth = width > 400 ? 400 : width - 20;

import Button from "../components/Button";
import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import TabInput from "../components/TabInput";

class TribesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tribes: [],
      isFetching: false,
      sort: "popular",
    };
  }

  componentDidMount() {
    this.fetchTribes();
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.route.params?.reload !== this.props.route.params?.reload) {
  //     this.onRefresh();
  //   }
  // }

  fetchTribes = () => {
    const { global } = this.props;
    const { sort } = this.state;
    fetch(
      `${Constants.SERVER_ADDR}/tribes?fid=${global.franchise?.id}&sort=${sort}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((tribes) => {
        this.setState({ tribes, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchTribes();
    });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    return (
      <TouchableScale
        activeScale={0.93}
        onPress={() => navigation.navigate("tribe", { slug: item.slug })}
        tension={10}
      >
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 10,
            borderRadius: 20,
          }}
        >
          {item.image ? (
            <Image
              source={{
                uri: Constants.SERVER_ADDR + item.image,
              }}
              style={{
                width: maxWidth,
                height: maxWidth,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          ) : null}

          <View
            style={{
              position: "absolute",
              left: 20,
              top: 10,
              width: width - 100,
            }}
          >
            <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 26 }}
              >
                {item?.name}
              </Text>
            </View>
            <View style={{ marginHorizontal: 5, marginVertical: 10, flex: 1 }}>
              <Text style={{ color: "white" }} numberOfLines={3}>
                {item?.tagline}
              </Text>
            </View>
          </View>
        </View>
      </TouchableScale>
    );
  };

  renderHeader = () => {
    return (
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text
          style={{
            fontSize: 26,
            fontFamily: "space-mono",
            fontWeight: "bold",
            maxWidth: 500,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {ExpoConstants.manifest.extra.title}
        </Text>

        <Text
          style={{
            maxWidth: 500,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {ExpoConstants.manifest.extra.subtitle}
        </Text>
      </View>
    );
  };

  renderFilter = () => {
    return (
      <TabInput
        tabs={["Popular", "Nearby"]}
        keys={["popular", "nearby"]}
        onChange={(sort) => this.setState({ sort })}
        selected={this.state.sort}
        selectedColor={"#404040"}
      />
    );
  };

  renderFooter = () => {
    const { navigation } = this.props;

    return (
      <View style={{ alignItems: "center" }}>
        <Text>Can't find what you're looking for?</Text>
        <Button
          title="Start a new tribe"
          onPress={() => navigation.navigate("createTribe")}
        />
      </View>
    );
  };

  render() {
    const { tribes } = this.state;
    const { navigation, global } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          numColumns={Math.floor(width / maxWidth)}
          ListHeaderComponent={() => {
            return (
              <View>
                {this.renderHeader()}
                {this.renderFilter()}
              </View>
            );
          }}
          ListFooterComponent={this.renderFooter}
          data={tribes}
          renderItem={this.renderItem}
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
    backgroundColor: "#FFF",
    paddingHorizontal: isBigDevice ? "20%" : 0,
    alignItems: "center",
  },
});

export default withGlobalContext(TribesScreen);
