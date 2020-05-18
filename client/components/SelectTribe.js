import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "../Constants";
import PositionedPopup from "../components/PositionedPopup";
import { withGlobalContext } from "../GlobalContext";

class SelectTribe extends React.Component {
  state = { tribe: null };
  componentDidMount() {
    this.fetchTribe();
  }
  fetchTribe = () => {
    const { global } = this.props;
    let slug = undefined;
    if (!slug) {
      slug = global.device.tribeslug;
    }

    if (!slug) {
      slug = global.me?.tribes?.[0].slug;
    }

    if (slug) {
      this.setState({ isFetching: true });
      fetch(
        `${Constants.SERVER_ADDR}/tribe?fid=${global.franchise?.id}&slug=${slug}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((tribe) => {
          this.setState({ tribe, isFetching: false });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  state = { tribe: null };
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
          <TouchableOpacity
            key={`tribe${tribe.id}`}
            onPress={() => {
              global.reloadTribe(global.device.loginToken, tribe.slug);
            }}
          >
            <View style={{ paddingVertical: 15 }}>
              <Text>{tribe.name}</Text>
            </View>
          </TouchableOpacity>
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
      <View>
        <TouchableOpacity
          onPress={this.togglePopup}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Tribe: {tribe?.name}
          </Text>
          <FontAwesome name="caret-down" size={20} style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        {this.state.popupVisible ? this.renderPopup() : null}
      </View>
    );
  };
}
export default withGlobalContext(SelectTribe);
