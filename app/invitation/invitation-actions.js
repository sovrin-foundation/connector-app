import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import TouchId from "react-native-touch-id";

class actions extends Component {
  _onAllow = () => {
    TouchId.authenticate("to let user allow connection")
      .then(success => {
        fetch("https://agency.evernym.com/callcenter/user/testdemo1/auth", {
          method: "PUT",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            newStatus: "ACCEPTED"
          })
        })
          .then(res => {
            if (res.status == 200) {
              this.saveRoute("CallCenter");
              this.props.navigation.navigate("CallCenter");
            } else {
              throw new Error("Bad Request");
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  async saveRoute(value) {
    try {
      await AsyncStorage.setItem("newCurrentRoute", value);
    } catch (error) {
      console.log("Error saving newCurrentRoute" + error);
    }
  }

  _onDeny = () => {
    this.saveRoute("Connections");
    this.props.navigation.navigate("Connections");
  };

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Button
            buttonStyle={buttonStyles.invitaitonActions}
            title="Deny"
            raised
            icon={{ name: "clear" }}
            onPress={this._onDeny}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            buttonStyle={buttonStyles.invitaitonActions}
            title="Allow"
            raised
            icon={{ name: "check" }}
            backgroundColor="#43a047"
            onPress={this._onAllow}
          />
        </View>
      </View>
    );
  }
}

const buttonStyles = StyleSheet.create({
  invitaitonActions: {
    marginRight: 0,
    marginLeft: 0
  }
});

export default actions;
