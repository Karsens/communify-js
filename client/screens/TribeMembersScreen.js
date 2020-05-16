import * as React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import Button from "../components/Button";

const Tab = createMaterialTopTabNavigator();

class TribeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tribe: null,
      isFetching: false,
    };
  }

  componentDidMount() {
    this.fetchTribe();
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
    const { tribe, isFetching } = this.state;
    const {
      global: { me },
    } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text>DESTINATIONS</Text>
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
});

export default withGlobalContext(TribeScreen);
