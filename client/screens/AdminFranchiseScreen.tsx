import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import { withGlobalContext } from "../GlobalContext";
import STYLE from "../Style";
import { Franchise, Global, Navigation } from "../Types";

interface Props {
  navigation: Navigation;
  global: Global;
}
interface State {
  password: string;
  response: string | null;
  name: string;
  franchises: Franchise[];
}
class AdminFranchiseScreen extends React.Component<{}, State> {
  constructor(props: Props) {
    super(props);

    props.navigation.setOptions({ headerTitle: "Franchises" });

    this.state = {
      franchises: [],
      password: "",
      response: null,
      name: "",
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

  deleteFranchise = (id: number) => {
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

  renderItem = ({ item }: { item: Franchise }) => {
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
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 10,
        }}
      >
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

export default withGlobalContext(AdminFranchiseScreen);
