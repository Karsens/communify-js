import * as React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";
import Button from "../components/Button";

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

  renderFetching = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
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
        {tribe ? this.renderTribe() : isFetching ? this.renderFetching() : null}
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
