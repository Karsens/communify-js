import * as React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Constants from "../Constants";
import { Ionicons } from "@expo/vector-icons";

class FileInput extends React.Component {
  state = { hasEdited: false };

  pickFile = async () => {
    try {
      this.setState({ loading: true });

      let result = await DocumentPicker.getDocumentAsync({ multiple: false });

      console.log("reulst", result);
      if (!result.type === "cancel") {
        this.setState({ loading: false, hasEdited: true }, () => {
          this.props.onChange(result.uri);
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (E) {
      console.log(E);
    }
  };

  render() {
    const { hasEdited, loading } = this.state;
    const { value, small, title } = this.props;

    const SIZE = small ? 40 : 200;
    return (
      <TouchableOpacity onPress={this.pickFile}>
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
            <Text>{value}</Text>
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

export default FileInput;
