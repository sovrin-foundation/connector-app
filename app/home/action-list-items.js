/**
 * @flow
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight
} from "react-native";
import { List, ListItem } from "react-native-elements";
import { Avatar, Icon } from "react-native-elements";
import Modal from "react-native-modalbox";

import Divider from "../components/divider";

class ActionListItems extends Component {
  openModal = () => {
    this.refs.modal1.open();
  };

  render() {
    const avatarDividerLeft = <Text>AVATAR PHOTOS</Text>;
    const avatarDividerRight = <Text>ADD</Text>;
    const emailDividerLeft = <Text>EMAIL ADDRESSES</Text>;
    const emailDividerRight = <Text>ADD</Text>;

    return (
      <View style={styles.container}>
        <Divider
          left={avatarDividerLeft}
          right={avatarDividerRight}
          containerStyle={{ marginTop: 10 }}
        />
        <View style={styles.listItemContainer}>
          <View style={[styles.avatarsContainer, styles.horizontalSpace]}>
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={require("../invitation/invitee.jpg")}
            />
            <Image
              style={styles.avatar}
              source={require("../invitation/invitee.jpg")}
            />
          </View>
        </View>
        <Divider left={emailDividerLeft} right={emailDividerRight} />
        <View style={styles.listItemContainer}>
          <View style={[styles.container, styles.horizontalSpace]}>
            <View style={styles.emailListItem}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <Icon name="person" />
                <View>
                  <Text>khageshhiet@gmail.com</Text>
                  <Text>Used by someone higher</Text>
                </View>
              </View>
            </View>
            <View>
              <Text>khagesh.sharma@evernym.com</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  horizontalSpace: {
    paddingHorizontal: 10
  },
  listItemContainer: {
    backgroundColor: "#FFFFFF"
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 5
  },
  avatarsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 5
  },
  emailListItem: {
    paddingVertical: 5
  }
});

export default ActionListItems;
