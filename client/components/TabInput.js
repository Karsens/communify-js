import React from "react";
import { LayoutAnimation, View, TouchableOpacity, Text } from "react-native";

interface Props {
  tabs: string[];
  keys: number[];
  onChange: (key: number) => void;
  selected: number;
  selectedColor: string;
}

class TabInput extends React.Component<Props> {
  render() {
    const { tabs, keys, onChange, selected, selectedColor } = this.props;
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }} />
        <View
          style={{
            borderRadius: 20,
            flexDirection: "row",
            borderColor: "black",
            borderWidth: 1,
            justifyContent: "space-around",
          }}
        >
          {tabs.map((tab, index) => {
            const extraStyle =
              index === 0
                ? {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                : {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  };
            return (
              <TouchableOpacity
                key={`tab${index}`}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

                  onChange(keys[index]);
                }}
              >
                <View
                  key={`index${index}`}
                  style={{
                    borderRadius: 20,
                    padding: 10,
                    backgroundColor:
                      selected === keys[index] ? selectedColor : "#FFF",
                    ...extraStyle,
                  }}
                >
                  <Text
                    style={
                      selected === keys[index]
                        ? { color: "#FFF" }
                        : { color: selectedColor }
                    }
                  >
                    {tab}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default TabInput;
