import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  AlertIOS,
} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { Avatar, Icon, Button } from 'react-native-elements'
import Lightbox from 'react-native-lightbox'
import { SwipeRow } from 'react-native-swipe-list-view'
import Swipeable from 'react-native-swipeable'

import { getItem } from '../services/secure-storage'
import Divider from '../components/divider'
import Badge from '../components/badge'
import styles from './action-list-items.styles'

const addButtonText = <Text style={styles.dividerLabel}>ADD</Text>
const avatarDividerLeft = <Text style={styles.dividerLabel}>AVATAR PHOTOS</Text>
const identifyingDividerLeft = (
  <Text style={styles.dividerLabel}>IDENTIFYING INFO</Text>
)
const addressesDividerLeft = <Text style={styles.dividerLabel}>ADDRESSES</Text>
const emailDividerLeft = (
  <Text style={styles.dividerLabel}>EMAIL ADDRESSES</Text>
)
const phoneDividerLeft = <Text style={styles.dividerLabel}>PHONE NUMBERS</Text>
const creditCardDividerLeft = (
  <Text style={styles.dividerLabel}>CREDIT CARDS</Text>
)

const rightActionButtons = [
  <TouchableOpacity
    style={[styles.rightSwipeItem, { backgroundColor: '#A0A0A0' }]}
  >
    <Text style={styles.swipeActionLeftText}>Edit</Text>
  </TouchableOpacity>,
  <TouchableOpacity
    style={[styles.rightSwipeItem, { backgroundColor: '#D0021B' }]}
  >
    <Text style={styles.swipeActionLeftText}>Remove</Text>
  </TouchableOpacity>,
]

const ListItemContainer = ({ children }) => (
  <View
    style={[
      styles.container,
      styles.listItem,
      styles.horizontalSpace,
      styles.listItemContainer,
    ]}
  >
    {children}
  </View>
)

const ListItemData = ({ label, itemValue }) => (
  <View style={styles.listItemContainer}>
    <Text style={styles.textLabel}>{label}</Text>
    <Text style={styles.listItemValue}>{itemValue}</Text>
  </View>
)

const IdentifyingInfo = ({ infos }) => (
  <View>
    {infos.map(info => {
      return (
        <ListItemContainer key={info.id}>
          <Badge counter={info.score} name={'grey'} />
          <ListItemData label={info.name.toUpperCase()} itemValue={info.data} />
        </ListItemContainer>
      )
    })}
  </View>
)

const SeeAllButton = ({ leftButtonText }) => (
  <TouchableOpacity style={[styles.container, styles.leftSwipeItem]}>
    <Text style={styles.leftSwipeItemText}>
      {leftButtonText}
    </Text>
  </TouchableOpacity>
)

const swipeableLeftProps = {
  leftButtonWidth: 140,
  leftActionReleaseAnimationFn: Animated.spring,
  leftButtons: [<SeeAllButton leftButtonText={'See all connections'} />],
}

class ActionListItems extends PureComponent {
  constructor() {
    super()
    this.state = {
      avatarTapCounts: 1,
    }
  }

  swipeStart = () => {
    this.props.isSwiping(true)
  }

  swipeEnd = () => {
    setTimeout(() => {
      this.props.isSwiping(false)
    }, 100)
  }

  avatarTap = () => {
    let taps = this.state.avatarTapCounts
    if (taps >= 3) {
      this.setState({ avatarTapCounts: 1 })
      Promise.all([getItem('identifier'), getItem('phone')]).then(
        values => {
          if (values.length == 0) {
            AlertIOS.alert('Identifier or phone not present')
          } else {
            const phoneNumber = values[1]
            const identifier = values[0]
            AlertIOS.alert(
              `Identifier - ${identifier}`,
              `Phone Number - ${phoneNumber}`
            )
            // TODO:KS Add signature
            fetch(`http://callcenter.evernym.com/agent/app-context`, {
              method: 'POST',
              mode: 'cors',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phoneNumber,
                identifier,
              }),
            })
              .then(res => {
                if (res.status != 200) {
                  throw new Error('Bad Request')
                }
              })
              .catch(console.log)
          }
        },
        error => {
          console.log(error)
        }
      )
    } else {
      taps = taps + 1
      this.setState({ avatarTapCounts: taps })
    }
  }

  render() {
    const { user: { isFetching, isPristine, data, error } } = this.props

    const { identifyingInfo, addresses, emails, phones } = data

    if (isFetching || isPristine) {
      // loading is in progress
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if (!isFetching && error.code) {
      // some error occurred while loading data for user
      return (
        <View style={styles.container}>
          <Text>Error fetching data</Text>
        </View>
      )
    }

    const swipeEvents = {
      onSwipeStart: this.swipeStart,
      onSwipeRelease: this.swipeEnd,
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
              source={require('../invitation/images/inviter.jpeg')}
              onPress={() => this.avatarTap()}
            />
            <Badge counter={76} name={'white'} badgeStyle={styles.badge} />
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
            <Swipeable
              {...swipeableLeftProps}
              {...swipeEvents}
              leftButtons={[
                <SeeAllButton leftButtonText={'SEE ALL CERTIFICATIONS'} />,
              ]}
            >
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
                <ListItemData
                  label={addresses[0].name.toUpperCase()}
                  itemValue={addresses[0].data}
                />
              </ListItemContainer>
            </Swipeable>
            <Swipeable
              {...swipeEvents}
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
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
            <Swipeable {...swipeableLeftProps} {...swipeEvents}>
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
                <ListItemData
                  label={emails[0].name.toUpperCase()}
                  itemValue={emails[0].data}
                />
              </ListItemContainer>
            </Swipeable>
            <Swipeable
              {...swipeEvents}
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={12} name={'grey'} />
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
            <Swipeable {...swipeableLeftProps} {...swipeEvents}>
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
                <ListItemData
                  label={phones[0].name.toUpperCase()}
                  itemValue={phones[0].data}
                />
              </ListItemContainer>
            </Swipeable>
            <Swipeable
              {...swipeEvents}
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
                <ListItemData
                  label={phones[1].name.toUpperCase()}
                  itemValue={phones[1].data}
                />
              </ListItemContainer>
            </Swipeable>
            <Swipeable
              {...swipeEvents}
              leftActionReleaseAnimationFn={Animated.spring}
              rightButtons={rightActionButtons}
            >
              <ListItemContainer>
                <Badge counter={21} name={'grey'} />
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
    )
  }
}

export default ActionListItems
