import React from "react";
import { DatePickerAndroid, TimePickerAndroid, View } from "react-native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

import CustomButtonWithValue from "./CustomButtonWithValue";
import PopUp from "./PopUp";
import Button from "./Button";

class DateTimeInput extends React.Component {
  state = { showPopup: false };
  getDateTimeAndroid = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
      });
      const time = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: true, // Will display '2 PM'
      });

      if (
        action !== DatePickerAndroid.dismissedAction &&
        time.action !== TimePickerAndroid.dismissedAction
      ) {
        const date = new Date(year, month, day, time.hour, time.minute);

        this.props.onChange(date);
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  renderPopup = () => {
    const { tenant } = this.props;

    return Platform.OS === "ios" ? (
      <PopUp
        visible={this.state.showPopup}
        title={this.props.title}
        onClose={this.toggleShowPopup}
      >
        <DateTimePicker
          mode="datetime"
          locale="nl-NL"
          value={this.props.value || new Date()}
          onChange={(event, date) => {
            this.props.onChange(date);
          }}
        />

        <Button onPress={this.toggleShowPopup} title="Ok" />
      </PopUp>
    ) : null;
  };

  toggleShowPopup = () => {
    if (Platform.OS === "android") {
      this.getDateTimeAndroid();
    } else {
      this.setState({ showPopup: !this.state.showPopup });
    }
  };

  render() {
    const { title, titleSelected, value } = this.props;
    const { showPopup } = this.state;
    return (
      <View>
        <CustomButtonWithValue
          title={value ? titleSelected : title}
          value={value ? moment(value).format("DD-MM-YYYY HH:mm") : ""}
          action={this.toggleShowPopup}
        />
        {this.renderPopup()}
      </View>
    );
  }
}

export default DateTimeInput;
