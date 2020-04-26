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
  constructor(props) {
    super(props);

    props.navigation.setOptions({ header: () => null });

    this.state = {
      franchises: [],
    };
  }
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
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Image
            source={{ uri: Constants.SERVER_ADDR + item.thumbnail }}
            style={{ width: 100, height: 100, borderRadius: 5 }}
          />
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
        <View style={{ flex: 1 }} />

        <Image
          source={require("../assets/icon.png")}
          style={{ width: 150, height: 150 }}
        />
        <Text
          style={{ fontSize: 26, fontFamily: "space-mono", fontWeight: "bold" }}
        >
          Bring your community, online courses, and memberships together in one
          app.
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View></View>
          <Button
            title="Start free"
            onPress={() => navigation.navigate("create")}
          />
          <View />
        </View>
        <View style={{ margin: 20 }}>
          <Text>
            These communities went before you. Click to see them live.
          </Text>
        </View>
        <FlatList
          data={franchises}
          style={{ height: 100, flex: 1 }}
          horizontal
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `item${index}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7394fb",
    alignItems: "center",
    justifyContent: "center",
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
