import * as React from "react";
import { FunctionComponent } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IProps = {
  visible: boolean,
  title?: string,
  onClose?: any,
  fullScreen?: boolean,
  children: any,
};

const PopUp: FunctionComponent<IProps> = ({
  visible,
  title,
  onClose,
  fullScreen,
  children,
}) => {
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.popUpBackground}>
        <View style={[styles.popUp, { flex: fullScreen ? 1 : 0 }]}>
          {title || onClose ? (
            <View style={styles.popUpHeader}>
              {title ? (
                <Text style={styles.popUpHeaderTitle}>{title}</Text>
              ) : null}
              {onClose ? (
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name={"md-close"} style={styles.popUpHeaderIcon} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popUpBackground: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  popUp: {
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  popUpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.5)",
  },
  popUpHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    padding: 20,
  },
  popUpHeaderIcon: {
    color: "#000",
    padding: 20,
  },
});

export default PopUp;
