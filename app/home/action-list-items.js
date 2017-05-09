import React, { PureComponent } from "react";
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
import styles from "./action-list-items.styles";

const addButtonText = <Text style={styles.dividerLabel}>ADD</Text>;
const avatarDividerLeft = (
  <Text style={styles.dividerLabel}>AVATAR PHOTOS</Text>
);
const identifyingDividerLeft = (
  <Text style={styles.dividerLabel}>IDENTIFYING INFO</Text>
);
const addressesDividerLeft = <Text style={styles.dividerLabel}>ADDRESSES</Text>;
const emailDividerLeft = (
  <Text style={styles.dividerLabel}>EMAIL ADDRESSES</Text>
);
const phoneDividerLeft = <Text style={styles.dividerLabel}>PHONE NUMBERS</Text>;
const creditCardDividerLeft = (
  <Text style={styles.dividerLabel}>CREDIT CARDS</Text>
);

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

const ListItemContainer = ({ children }) => (
  <View
    style={[
      styles.container,
      styles.listItem,
      styles.horizontalSpace,
      styles.listItemContainer
    ]}
  >
    {children}
  </View>
);

const ListItemData = ({ label, itemValue }) => (
  <View style={styles.listItemContainer}>
    <Text style={styles.textLabel}>{label}</Text>
    <Text style={styles.listItemValue}>{itemValue}</Text>
  </View>
);

const IdentifyingInfo = ({ infos }) => (
  <View>
    {infos.map(info => {
      return (
        <ListItemContainer key={info.id}>
          <Badge counter={info.score} name={"grey"} />
          <ListItemData label={info.name.toUpperCase()} itemValue={info.data} />
        </ListItemContainer>
      );
    })}
  </View>
);

class ActionListItems extends PureComponent {
  render() {
    const { user: { isFetching, isPristine, data, error } } = this.props;

    const { identifyingInfo, addresses, emails, phones } = data;

    if (isFetching || isPristine) {
      // loading is in progress
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!isFetching && error.code) {
      // some error occurred while loading data for user
      return (
        <View style={styles.container}>
          <Text>Error fetching data</Text>
        </View>
      );
    }

    // data is fetched and there is no error, go ahead and render component
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
              source={require("../invitation/inviter.jpeg")}
            />
            <Badge counter={76} name={"white"} badgeStyle={styles.badge} />
          </View>
        </View>

        <Divider
          left={identifyingDividerLeft}
          right={addButtonText}
          containerStyle={{ marginTop: 3 }}
        />
        <IdentifyingInfo infos={identifyingInfo} />

        <Divider left={addressesDividerLeft} right={addButtonText} />
        <View>
          <View style={[styles.container]}>
            <SwipeRow leftOpenValue={150} disableLeftSwipe={true} tension={0}>
              <View style={[styles.container, styles.swipeActionContainer]}>
                <View style={[styles.swipeActionLeft]}>
                  <Text style={styles.swipeActionLeftText}>
                    SEE ALL CERTIFICATIONS
                  </Text>
                </View>
              </View>
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={addresses[0].name.toUpperCase()}
                  itemValue={addresses[0].data}
                />
              </ListItemContainer>
            </SwipeRow>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={addresses[1].name.toUpperCase()}
                  itemValue={addresses[1].data}
                />
              </ListItemContainer>
            </Swipeable>
          </View>
        </View>

        <Divider left={emailDividerLeft} right={addButtonText} />
        <View>
          <View style={[styles.container]}>
            <SwipeRow leftOpenValue={150} disableLeftSwipe={true} tension={0}>
              <View style={[styles.container, styles.swipeActionContainer]}>
                <View style={[styles.swipeActionLeft]}>
                  <Text style={styles.swipeActionLeftText}>
                    See all connections
                  </Text>
                </View>
              </View>
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={emails[0].name.toUpperCase()}
                  itemValue={emails[0].data}
                />
              </ListItemContainer>
            </SwipeRow>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={12} name={"grey"} />
                <ListItemData
                  label={emails[1].name.toUpperCase()}
                  itemValue={emails[1].data}
                />
              </ListItemContainer>
            </Swipeable>
          </View>
        </View>

        <Divider left={phoneDividerLeft} right={addButtonText} />
        <View>
          <View style={[styles.container]}>
            <SwipeRow leftOpenValue={150} disableLeftSwipe={true} tension={0}>
              <View style={[styles.container, styles.swipeActionContainer]}>
                <View style={[styles.swipeActionLeft]}>
                  <Text style={styles.swipeActionLeftText}>
                    See all connections
                  </Text>
                </View>
              </View>
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={phones[0].name.toUpperCase()}
                  itemValue={phones[0].data}
                />
              </ListItemContainer>
            </SwipeRow>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={phones[1].name.toUpperCase()}
                  itemValue={phones[1].data}
                />
              </ListItemContainer>
            </Swipeable>
            <Swipeable
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={"grey"} />
                <ListItemData
                  label={phones[2].name.toUpperCase()}
                  itemValue={phones[2].data}
                />
              </ListItemContainer>
            </Swipeable>
          </View>
        </View>

        {/*<Divider left={creditCardDividerLeft} right={addButtonText} />
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
        </View>*/}

      </View>
    );
  }
}

export default ActionListItems;
