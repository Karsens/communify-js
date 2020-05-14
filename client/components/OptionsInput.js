import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
class OptionsInput extends React.Component {
  openActionSheet = () => {
    const { options, onChange } = this.props;
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const actionSheetOptions = options.map((option) => option.label);
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = undefined;

    this.props.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
        onChange(options[buttonIndex].key);
      }
    );
  };

  render() {
    const { title, options, value, onChange } = this.props;
    return (
      <TouchableOpacity onPress={this.openActionSheet}>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
            flexDirection: "row",
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{options.find((o) => o.key === value)?.label}</Text>
            <Ionicons
              name="md-arrow-dropright"
              size={24}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const ConnectedApp = connectActionSheet(OptionsInput);

export default ConnectedApp;
