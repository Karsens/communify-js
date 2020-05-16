import * as React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TribeDestinationsScreen from "../screens/TribeDestinationsScreen";
import TribeMapScreen from "../screens/TribeMapScreen";
import TribeMembersScreen from "../screens/TribeMembersScreen";

import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";

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
        `${Constants.SERVER_ADDR}/tribe?fid=${global.franchise?.id}&slug=${slug}&token=${global.device.loginToken}`,
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

  join = (id) => {
    const { global } = this.props;

    fetch(`${Constants.SERVER_ADDR}/joinTribe`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginToken: global.device.loginToken,
        id,
      }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        this.setState({ joinResponse: response, isFetching: false });
        global.reloadMe(global.device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderNoTribe = () => {
    const { navigation, global } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>You're not part of a tribe yet. </Text>
        {global.device.logged ? (
          <>
            <Button
              onPress={() => navigation.navigate("tribes")}
              title="Click here to see all tribes"
            />
            <Button
              onPress={() => navigation.navigate("createTribe")}
              title="Click here to start a new tribe"
            />
          </>
        ) : (
          <>
            <Button
              onPress={() => navigation.navigate("signup")}
              title="Click here to sign up"
            />
            <Button
              onPress={() => navigation.navigate("login")}
              title="Click here to login"
            />
          </>
        )}
      </View>
    );
  };

  renderFetching = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  };

  renderMyTribe = () => {
    const { tribe } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Text>Tribe: {tribe.name}</Text>
        <Tab.Navigator>
          <Tab.Screen name="destinations" component={TribeDestinationsScreen} />
          <Tab.Screen name="map" component={TribeMapScreen} />
          <Tab.Screen name="members" component={TribeMembersScreen} />
        </Tab.Navigator>
      </View>
    );
  };

  renderTribe = () => {
    const { tribe, joinResponse } = this.state;

    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 26 }}>{tribe.name}</Text>
        <Text>{tribe.tagline}</Text>

        <Separator />

        {joinResponse ? <Text>{joinResponse}</Text> : null}
        <Button title="Join" onPress={() => this.join(tribe.id)} />
      </View>
    );
  };

  render() {
    const { tribe, isFetching } = this.state;
    const {
      global: { me },
    } = this.props;

    const imInTribe = !!me?.tribes?.find((t) => t.id === tribe?.id);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {tribe
          ? imInTribe
            ? this.renderMyTribe()
            : this.renderTribe()
          : isFetching
          ? this.renderFetching()
          : this.renderNoTribe()}
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
