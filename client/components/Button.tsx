import * as Icon from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  icon?: string;
  font?: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}
class Button extends React.Component<Props> {
  render() {
    const { icon, font, title, onPress, disabled, style } = this.props;

    const TheIcon = font && icon ? Icon[font] : View;

    return (
      <TouchableOpacity onPress={disabled ? undefined : onPress}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: disabled ? "#404040" : "#222",
            padding: 10,
            marginVertical: 5,
            justifyContent: "center",
            paddingHorizontal: 20,
            borderRadius: 20,
            ...style,
          }}
        >
          {font && icon ? (
            <View style={{ marginRight: 20 }}>
              <TheIcon name={icon} color="white" size={20} />
            </View>
          ) : null}

          <Text style={{ textAlign: "center", color: "white" }}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Button;
