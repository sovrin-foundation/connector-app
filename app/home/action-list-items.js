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
import Badge from "../components/badge";

class ActionListItems extends Component {
  openModal = () => {
    this.refs.modal1.open();
  };

  render() {
    const addButtonText = <Text style={styles.dividerLabel}>ADD</Text>;
    const avatarDividerLeft = <Text style={styles.dividerLabel}>AVATAR PHOTOS</Text>;
    const identifyingDividerLeft = <Text style={styles.dividerLabel}>IDENTIFYING INFO</Text>;
    const addressesDividerLeft = <Text style={styles.dividerLabel}>ADDRESSES</Text>;
    const emailDividerLeft = <Text style={styles.dividerLabel}>EMAIL ADDRESSES</Text>;
    const phoneDividerLeft = <Text style={styles.dividerLabel}>PHONE NUMBERS</Text>;
    const creditCardDividerLeft = <Text style={styles.dividerLabel}>CREDIT CARDS</Text>;  

    const rightActionButtons = [
      <TouchableOpacity
        style={[styles.rightSwipeItem, { backgroundColor: "#A0A0A0" }]}
      >
        <Text style={styles.swipeActionLeftText}>Edit</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        style={[styles.rightSwipeItem, { backgroundColor: "#D0021B" }]}
      >
        <Text style={styles.swipeActionLeftText}>Remove</Text>
      </TouchableOpacity>
    ];

    return (
      <View style={styles.container}>
        <Divider
          left={avatarDividerLeft}
          right={addButtonText}
          containerStyle={{ marginTop: 3 }}
        />

        <View style={styles.listItemContainer}>
          <View style={[styles.avatarsContainer, styles.horizontalSpace]}>
            <Avatar
              containerStyle={styles.avatar}
              medium
              rounded
              source={require("../invitation/invitee.png")}
            />            
            <Badge 
              counter={76} 
              name={"white"} 
              badgeStyle={styles.badge} />
          </View>
        </View>

        <Divider
          left={identifyingDividerLeft}
          right={addButtonText}
          containerStyle={{ marginTop: 3 }}
        />        
        <View
          style={[
            styles.container,
            styles.listItem,
            styles.horizontalSpace,
            styles.listItemContainer
          ]}
        >
          <Badge counter={76} name={"grey"} />
          <View style={styles.listItemContainer}>
            <Text style={styles.textLabel}>NAME</Text>
            <Text style={styles.listItemValue}>John Best</Text>
          </View>
        </View>
        <View
          style={[
            styles.container,
            styles.listItem,
            styles.horizontalSpace,
            styles.listItemContainer
          ]}
        >
          <Badge counter={21} name={"grey"} />
          <View style={styles.listItemContainer}>
          <Text style={styles.textLabel}>DATE OF BIRTH</Text>
          <Text style={styles.listItemValue}>11/14/1968</Text>
          </View>
        </View>               

        <Divider left={addressesDividerLeft} right={addButtonText} />
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
                    SEE ALL CERTIFICATIONS
                  </Text>
                </View> 
              </View>
              <View
                style={[
                  styles.container,
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>HOME ADDRESS</Text>
                  <Text style={styles.listItemValue}>11453 Lesterbend Circle NW Stream Harbor, WA 98329</Text>
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
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>MAILING ADDRESS</Text>
                  <Text style={styles.listItemValue}>11453 Lesterbend Circle NW Stream Harbor, WA 98329</Text>
                </View>
              </View>
            </Swipeable>
          </View>
        </View>        

        <Divider left={emailDividerLeft} right={addButtonText} />
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
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>EMAIL ADDRESS 1</Text>
                  <Text style={styles.listItemValue}>khageshhiet@gmail.com</Text>
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
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={12} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>EMAIL ADDRESS 2</Text>
                  <Text style={styles.listItemValue}>khagesh.sharma@evernym.com</Text>
                </View>
              </View>
            </Swipeable>
          </View>
        </View>

        <Divider left={phoneDividerLeft} right={addButtonText} />
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
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>HOME PHONE NUMBER</Text>
                  <Text style={styles.listItemValue}>253-444-5677</Text>
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
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>MOBILE PHONE NUMBER</Text>
                  <Text style={styles.listItemValue}>844-456-2346</Text>
                </View>
              </View>
            </Swipeable>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <View
                style={[
                  styles.container,
                  styles.listItem,
                  styles.horizontalSpace,
                  styles.listItemContainer
                ]}
              >
                <Badge counter={21} name={"grey"} />
                <View style={styles.listItemContainer}>
                  <Text style={styles.textLabel}>WORK PHONE NUMBER</Text>
                  <Text style={styles.listItemValue}>844-238-0987</Text>
                </View>
              </View>
            </Swipeable>            
          </View>
        </View>

        <Divider
          left={creditCardDividerLeft}
          right={addButtonText}
        />
        <View style={styles.listItemContainer}>
          <View style={[styles.creditCardContainer, styles.horizontalSpace]}>
            <Image
              style={styles.creditCard} 
              resizeMode="contain"
              source={require("../images/img_visa.png")}
            />
            <Image
              style={styles.creditCard}
              resizeMode="contain"
              source={require("../images/img_visa.png")}
            />
          </View>

          <View style={[styles.creditCardContainer, styles.horizontalSpace]}>            
            <Image
              style={styles.creditCard}
              resizeMode="contain"
              source={require("../images/img_usaa.png")}
            />
            <Image
              style={styles.creditCard}
              resizeMode="contain"
              source={require("../images/img_amex.png")}
            />                                    
          </View>
        </View>        

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EBEBEA",
    flex: 1
  },
  horizontalSpace: {
    paddingHorizontal: 10
  },
  dividerLabel: {
    color: "#242B2D"
  },
  listItemContainer: {
    backgroundColor: "#FFFFFF",
    paddingLeft: 10
  },
  badge: {
    backgroundColor: "rgba(52, 52, 52, 0.0)",
    left: 0,
    position: "absolute"
  },
  avatar: {
    top: 5,
    left: 2,
    position: "absolute"
  },
  avatarsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 5,
    height: 60
  },
  listItem: {
    paddingVertical: 10,
    flexDirection: "row",
    marginBottom: 3,
    alignItems: 'center'    
  },
  textLabel: {
    color: "#535353",
    fontSize: 12,
    marginBottom: 5
  },  
  listItemValue: {
    fontWeight: "bold",
    fontSize: 15
  },  
  swipeActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#85BF43",
    marginBottom: 3
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "center",
    width: 150
  },
  swipeActionLeftText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20
  },
  creditCardContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 0,
    paddingVertical: 5,
    justifyContent: "space-around"
  },
  creditCard: {
    width: 145,
    height: 100
  },  
});

export default ActionListItems;
