import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import Swipeable from 'react-native-swipeable'
import {
  InfoSectionList,
  UserInfoAvatarSection,
  IdentifyingInfoSection,
  UserInfoAddressSection,
  UserInfoEmailSection,
  UserInfoPhoneSection,
  Container,
} from '../components'

class UserInfoItems extends PureComponent {
  swipeStart = () => {
    this.props.isSwiping(true)
  }

  swipeEnd = () => {
    setTimeout(() => {
      this.props.isSwiping(false)
    }, 100)
  }

  render() {
    const {
      user: { isFetching, isPristine, data, error },
      avatarTapped,
      avatarTapCount,
      sendUserInfo,
      resetAvatarTapCount,
      config,
    } = this.props

    if (isFetching || isPristine) {
      // loading is in progress
      return (
        <Container>
          <Text>Loading...</Text>
        </Container>
      )
    }

    if (!isFetching && error.code) {
      // some error occurred while loading data for user
      return (
        <Container>
          <Text>Error fetching data</Text>
        </Container>
      )
    }

    const { identifyingInfo, addresses, emails, phones } = data

    // data is fetched and there is no error, go ahead and render component
    return (
      <InfoSectionList>
        <UserInfoAvatarSection
          avatarTapped={avatarTapped}
          avatarTapCount={avatarTapCount}
          sendUserInfo={sendUserInfo}
          resetAvatarTapCount={resetAvatarTapCount}
          config={config}
        />
        {identifyingInfo && <IdentifyingInfoSection infos={identifyingInfo} />}
        {addresses &&
          <UserInfoAddressSection
            addresses={addresses}
            onSwipeStart={this.swipeStart}
            onSwipeRelease={this.swipeEnd}
          />}
        {emails &&
          <UserInfoEmailSection
            emails={emails}
            onSwipeStart={this.swipeStart}
            onSwipeRelease={this.swipeEnd}
          />}
        {phones &&
          <UserInfoPhoneSection
            phones={phones}
            onSwipeStart={this.swipeStart}
            onSwipeRelease={this.swipeEnd}
          />}
      </InfoSectionList>
    )
  }
}

export default UserInfoItems
