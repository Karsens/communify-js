import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  View,
  TextInput,
} from "react-native";
import STYLE from "../Style";
import { Ionicons } from "@expo/vector-icons";

import { withGlobalContext } from "../GlobalContext";
import Constants from "../Constants";

class AdminFranchiseScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Admin" });

    this.state = {
      franchises: [],
    };
  }

  componentDidMount() {
    this.fetchFranchises();
  }

  fetchFranchises = () => {
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
  };

  deleteFranchise = (id) => {
    const { password } = this.state;
    fetch(`${Constants.SERVER_ADDR}/deleteFranchise`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, id }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        this.fetchFranchises();
        this.setState({ response });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  createFranchise = () => {
    const { password, name } = this.state;
    fetch(`${Constants.SERVER_ADDR}/createFranchise`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, name }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        this.fetchFranchises();
        this.setState({ response });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text>{item.id}</Text>
        <Text>{item.name}</Text>
        <TouchableOpacity onPress={() => this.deleteFranchise(item.id)}>
          <Ionicons name="ios-remove-circle" color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  renderCreateSection = () => {
    const { password, response, name } = this.state;

    return (
      <View>
        <Text>{response}</Text>
        <TextInput
          style={STYLE.textInput}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={(password) => this.setState({ password })}
        />
        <TextInput
          style={STYLE.textInput}
          placeholder="Name"
          value={name}
          onChangeText={(name) => this.setState({ name })}
        />
        <Button title="Create" onPress={this.createFranchise} />
      </View>
    );
  };
  render() {
    const { franchises } = this.state;

    return (
      <View style={styles.container}>
        {this.renderCreateSection()}
        <FlatList
          data={franchises}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}index`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default withGlobalContext(AdminFranchiseScreen);
