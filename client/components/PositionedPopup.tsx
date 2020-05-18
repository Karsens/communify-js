import * as React from "react";
import { FunctionComponent } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  toggle: () => void;
  children: any;
  marginTop: number;
  /**
   * pixels from the right where to show pointer
   */
  pointerRight: number;
  paddingHorizontal?: number;
}

const PositionedPopup: FunctionComponent<Props> = ({
  title,
  toggle,
  children,
  marginTop,
  pointerRight,
  paddingHorizontal = 20,
}) => {
  return (
    <Modal
      animated={true}
      animationType="fade"
      transparent
      onRequestClose={toggle}
    >
      <View style={{ backgroundColor: "rgba(100,100,100,0.5)", flex: 1 }}>
        <SafeAreaView>
          <View
            style={{
              backgroundColor: "#FFF",
              margin: 10,
              marginTop,
              paddingVertical: 20,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                position: "absolute",
                backgroundColor: "white",
                width: 15,
                height: 15,
                right: pointerRight,
                top: -7,
                transform: [{ rotate: "45deg" }],
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>

              <TouchableOpacity
                onPress={toggle}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Ionicons name={"md-close"} color={"#000"} size={32} />
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: paddingHorizontal }}>
              {children}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
export default PositionedPopup;
