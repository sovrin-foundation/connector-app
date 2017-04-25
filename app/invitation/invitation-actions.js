import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import TouchId from "react-native-touch-id";

class actions extends Component {
  _onAllow = () => {
    TouchId.authenticate("to let user allow connection")
      .then(success => {
        fetch("https://agency.evernym.com/callcenter/user/testdemo1/auth")
          .then(res => res.json())
          .then(resData => {
            console.log(resData);
            this.props.navigation.navigate("CallCenter");
          });
      })
      .catch(error => {
        // Fallback option to add
      });
  };

  _onDeny = () => {
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
