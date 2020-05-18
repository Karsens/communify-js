import * as React from "react";
import { Dimensions, StyleSheet, Text, View, SafeAreaView } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BottomSheet from "reanimated-bottom-sheet";

import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import Button from "../components/Button";
import SelectTribe from "../components/SelectTribe";

const Tab = createMaterialTopTabNavigator();

class TribeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tribe: null,
      isFetching: false,
    };
  }

  async componentDidMount() {
    this.fetchTribe();

    if (Platform.OS !== "web") {
      const MapView = await import("react-native-maps");
      this.setState({ MapView: MapView.default });
    }
  }

  fetchTribe = () => {
    const { global } = this.props;
    let slug = this.props.route.params?.slug;

    if (!slug) {
      slug = global.device.tribeslug;
    }

    if (!slug) {
      slug = global.me?.tribes?.[0].slug;
    }

    if (slug) {
      this.setState({ isFetching: true });
      fetch(
        `${Constants.SERVER_ADDR}/tribe?fid=${global.franchise?.id}&slug=${slug}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((tribe) => {
          this.setState({ tribe, isFetching: false });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  render() {
    const { tribe, isFetching, MapView } = this.state;
    const {
      global: { me },
    } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {!MapView ? (
          <Text>Please download the app</Text>
        ) : (
          <MapView style={styles.mapStyle}>
            <SelectTribe />
          </MapView>
        )}
      </SafeAreaView>
    );
  }
}

TribeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
});

export default withGlobalContext(TribeScreen);
