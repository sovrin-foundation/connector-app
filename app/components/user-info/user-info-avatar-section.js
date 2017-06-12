import React, { PureComponent } from 'react'
import { View, AlertIOS } from 'react-native'
import { connect } from 'react-redux'
import Divider from '../divider'
import { ListItem, ListItemData } from '../info-section-list'
import { BadgeAvatar, Avatar } from '../avatar'
import { ItemDividerLabel } from '../../styled-components/common-styled'
import { addButtonText } from './user-info-common-components'
import { getItem } from '../../services/secure-storage'
import { TapCount, SendAppContext } from '../../home/home-store'

/**
 * TODO:KS
 * - Create common component for Divider label
 * - Add styles so that images can wrap in another line if not enough space
 * - Add vertical spacing to avatars instead of ListItem so that 
 *    when we wrap photos in multiple lines, we get desired spacing from everyside
 */
const avatarDividerLeft = <ItemDividerLabel>AVATAR PHOTOS</ItemDividerLabel>

class UserInfoAvatarSection extends PureComponent {
  constructor(props) {
    super(props)
  }

  showAlert = () => {
    Promise.all([getItem('identifier'), getItem('phone')])
      .then(([identifier, phoneNumber]) => {
        if (identifier || phoneNumber) {
          AlertIOS.alert('Identifier or phone not present')
        } else {
          AlertIOS.alert(
            `Identifier - ${identifier}`,
            `Phone Number - ${phoneNumber}`
          )
          this.props.appContext({
            phoneNumber,
            identifier,
          })
        }
      })
      .catch(error => {
        console.log(
          'LOG: getItem for identifier or phoneNumber failed, ',
          error
        )
      })
  }

  avatarTap = () => {
    let count = this.props.home.avatarTapCount + 1
    this.props.tapCount(count)
    if (count == 3) {
      this.showAlert()
      this.props.tapCount(0)
    }
  }

  render() {
    return (
      <View>
        <Divider left={avatarDividerLeft} right={addButtonText} />
        <ListItem>
          <ListItemData>
            <BadgeAvatar
              count={76}
              small
              src={require('../../invitation/images/inviter.jpeg')}
              onPress={this.avatarTap}
            />
          </ListItemData>
        </ListItem>
      </View>
    )
  }
}

const mapStateToProps = ({ home }) => ({
  home,
})

const mapDispatchToProps = dispatch => ({
  tapCount: count => dispatch(TapCount(count)),
  appContext: context => dispatch(SendAppContext(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  UserInfoAvatarSection
)
