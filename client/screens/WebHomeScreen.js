import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
  View,
} from "react-native";

import Button from "../components/Button";

import { ScrollView } from "react-native-gesture-handler";
import Constants from "../Constants";

export default class HomeScreen extends React.Component {
  state = {
    franchises: [],
  };
  componentDidMount() {
    fetch(`${Constants.SERVER_ADDR}/franchises`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((franchises) => {
        this.setState({ franchises });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const host = window.location.host.split(".").splice(0, 2);
          Linking.openURL(`https://${item.slug}.${host}`);
        }}
      >
        <View
          style={{
            backgroundColor: "#CCC",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 100,
            borderRadius: 10,
            marginRight: 10,
          }}
        >
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation, route } = this.props;
    const { franchises } = this.state;

    return (
      <View style={styles.container}>
        <Text
          style={{ fontSize: 26, fontFamily: "Recoleta", fontWeight: "bold" }}
        >
          Bring your community, online courses, and memberships together in one
          place.
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View></View>
          <Button
            title="Start free"
            onPress={() => navigation.navigate("create")}
          />
          <View />
        </View>

        <Text>These communities went before you. Click to see them live.</Text>
        <FlatList
          data={franchises}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `item${index}`}
        />
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
