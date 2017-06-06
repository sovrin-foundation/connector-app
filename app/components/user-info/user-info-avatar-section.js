import React, { PureComponent } from 'react'
import { View, AlertIOS } from 'react-native'
import Divider from '../divider'
import { ListItem, ListItemData } from '../info-section-list'
import { BadgeAvatar, Avatar } from '../avatar'
import { ItemDividerLabel } from '../../styled-components/common-styled'
import { addButtonText } from './user-info-common-components'
import { getItem } from '../../services/secure-storage'

/**
 * TODO:KS
 * - Create common component for Divider label
 * - Add styles so that images can wrap in another line if not enough space
 * - Add vertical spacing to avatars instead of ListItem so that 
 *    when we wrap photos in multiple lines, we get desired spacing from everyside
 */
const avatarDividerLeft = <ItemDividerLabel>AVATAR PHOTOS</ItemDividerLabel>

export default class UserInfoAvatarSection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      avatarTapCounts: 0,
    }
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
