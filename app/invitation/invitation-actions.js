import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import TouchId from "react-native-touch-id";

class actions extends Component {
  _onAllow = () => {
    this.AuthRequest("ACCEPTED");
  };

  _onDeny = () => {
    this.AuthRequest("REJECTED");
  };

  AuthRequest = type => {
    TouchId.authenticate("Please confirm with TouchID")
      .then(success => {
        this.getKey("PN_username").then(username => {
          fetch(`https://agency.evernym.com/callcenter/user/${username}/auth`, {
            method: "PUT",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              newStatus: type
            })
          })
            .then(res => {
              if (res.status == 200) {
                if (type === "ACCEPTED") {
                  this.saveKey("CallCenter");
                  this.props.navigation.navigate("CallCenter");
                } else if (type === "REJECTED") {
                  this.saveKey("Home");
                  this.props.navigation.navigate("Home");
                }
              } else {
                throw new Error("Bad Request");
              }
            })
            .catch(error => console.log(error));
        });
      })
      .catch(error => console.log(error));
  };

  async saveKey(value) {
    try {
      await AsyncStorage.setItem("newCurrentRoute", value);
    } catch (error) {
      console.log("Error saving newCurrentRoute" + error);
    }
  }

  async getKey(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log("Error retrieving newCurrentRoute" + error);
    }
  }

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
