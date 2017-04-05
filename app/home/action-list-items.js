/**
 * @flow
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Animated
} from "react-native";
import { List, ListItem } from "react-native-elements";
import { Avatar, Icon, Button } from "react-native-elements";
import Lightbox from "react-native-lightbox";
import { SwipeRow } from "react-native-swipe-list-view";
import Swipeable from "react-native-swipeable";

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

    const rightActionButtons = [
      <TouchableOpacity
        style={[styles.rightSwipeItem, { backgroundColor: "#9E9E9E" }]}
      >
        <Text style={styles.swipeActionLeftText}>Edit</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        style={[styles.rightSwipeItem, { backgroundColor: "#c62828" }]}
      >
        <Text style={styles.swipeActionLeftText}>Remove</Text>
      </TouchableOpacity>
    ];

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
        <View>
          <View style={[styles.container]}>
            <SwipeRow
              leftOpenValue={150}
              disableLeftSwipe={true}
              tension={0}
            >
              <View style={[styles.container, styles.swipeActionContainer]}>
                <View style={[styles.swipeActionLeft]}>
                  <Text style={styles.swipeActionLeftText}>
                    See all connections
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.container,
                  styles.emailListItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Icon name="email" />
                <View style={styles.emailTextContainer}>
                  <Text style={styles.emailTextLabel}>Email Address 1</Text>
                  <Text>khageshhiet@gmail.com</Text>
                </View>
              </View>
            </SwipeRow>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <View
                style={[
                  styles.container,
                  styles.emailListItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Icon name="email" />
                <View style={styles.emailTextContainer}>
                  <Text style={styles.emailTextLabel}>Email Address 2</Text>
                  <Text>khagesh.sharma@evernym.com</Text>
                </View>
              </View>
            </Swipeable>
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
    paddingVertical: 5,
    flexDirection: "row",
    marginBottom: 3
  },
  emailTextContainer: {
    paddingLeft: 10
  },
  emailTextLabel: {
    color: "#757575"
  },
  swipeActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#558b2f",
    marginBottom: 3
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "center",
    width: 150
  },
  swipeActionLeftText: {
    color: "#FFFFFF"
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20
  }
});

export default ActionListItems;
