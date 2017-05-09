import React, { PureComponent, PropTypes } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, Icon } from "react-native-elements";

import ActionsIcons from "./action-icons";
import ActionListItems from "./action-list-items";

// TODO: Add reselect to avoid rerenders in functional components
const HomeScreenActions = ({ user }) => (
  <View>
    <View>
      <ActionsIcons />
    </View>
    <View>
      <ActionListItems user={user} />
    </View>
  </View>
);

export default HomeScreenActions;
