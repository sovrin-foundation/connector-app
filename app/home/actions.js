/**
 * @flow
 */

import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, Icon } from "react-native-elements";

import ActionsIcons from "./action-icons";
import ActionListItems from './action-list-items';

export default class HomeScreenActions extends Component {
  render() {
    return (
      <View>
        <View>
          <ActionsIcons />
        </View>
        <View>
          <ActionListItems />
        </View>
      </View>
    );
  }
}
