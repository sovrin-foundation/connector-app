import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const actions = () => (
  <View style={{ flexDirection: "row" }}>
    <View style={{ flex: 1 }}>
      <Button
        buttonStyle={buttonStyles.invitaitonActions}
        title="Deny"
        raised
        icon={{ name: "clear" }}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Button
        buttonStyle={buttonStyles.invitaitonActions}
        title="Allow"
        raised
        icon={{ name: "check" }}
        backgroundColor="#43a047"
      />
    </View>
  </View>
);

const buttonStyles = StyleSheet.create({
  invitaitonActions: {
    marginRight: 0,
    marginLeft: 0
  }
});

export default actions;
