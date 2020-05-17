import * as React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IProps {
  title: string;
  value: string;
  action: any;
  disabled?: boolean;
  backgroundColor?: string;
  arrow?: boolean;
  titleColor?: string;
  valueColor?: string;
  noUnderline?: boolean;
  style?: object;
  textStyle?: object;
}

const CustomButtonWithValue: FunctionComponent<IProps> = ({
  title,
  value,
  action,
  disabled,
  backgroundColor,
  titleColor,
  arrow,
  valueColor,
  style,
  textStyle,
  noUnderline,
}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : action}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 15,
        },
        { backgroundColor: backgroundColor ? backgroundColor : "#FFF" },
        noUnderline
          ? undefined
          : {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: "#CCC",
            },
        style,
      ]}
    >
      <Text
        style={[
          {
            color: disabled ? "#CCC" : titleColor ? titleColor : "#000",
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={[{ color: valueColor ? valueColor : "#CCC" }]}>
          {value}
        </Text>
        {arrow ? (
          <Ionicons
            style={{ marginLeft: 10 }}
            name={"arrow-right"}
            color={"#CCC"}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButtonWithValue;
