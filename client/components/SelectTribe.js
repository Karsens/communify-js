import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome } from "@expo/vector-icons";

import PositionedPopup from "../components/PositionedPopup";

const Tab = createMaterialTopTabNavigator();

class SelectTribe extends React.Component {
  renderPopup = () => {
    const { global } = this.props;
    return (
      <PositionedPopup
        marginTop={60}
        pointerRight={150}
        title="Tribe"
        toggle={this.togglePopup}
        paddingHorizontal={20}
      >
        {global.me.tribes?.map((tribe) => (
          <View style={{ paddingVertical: 15 }} key={`tribe${tribe.id}`}>
            <Text>{tribe.name}</Text>
          </View>
        ))}
      </PositionedPopup>
    );
  };

  togglePopup = () => {
    this.setState({ popupVisible: !this.state.popupVisible });
  };

  render = () => {
    const { tribe } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.togglePopup}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Tribe: {tribe.name}
          </Text>
          <FontAwesome name="caret-down" size={20} style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        {this.state.popupVisible ? this.renderPopup() : null}
      </View>
    );
  };
}
export default SelectTribe;
