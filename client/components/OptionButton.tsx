import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

function OptionButton({
  icon,
  image,
  label,
  onPress,
  isLastOption,
}: {
  icon: string;
  image: { uri: string };
  label: string;
  onPress: () => void;
  isLastOption: boolean;
}) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          {image ? (
            <Image
              source={image}
              style={{ width: 22, height: 22, borderRadius: 11 }}
            />
          ) : (
            <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
          )}
        </View>
        <View>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  optionIconContainer: {
    marginRight: 12,
    width: 30,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
});

export default OptionButton;
