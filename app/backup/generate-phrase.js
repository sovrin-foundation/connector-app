// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Image, Dimensions } from 'react-native'
import { StackNavigator } from 'react-navigation'
import type { Store } from '../store/type-store'
import type { ReactNavigation } from '../common/type-common'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
} from '../components'
import { SHORT_DEVICE } from '../common/styles'
import { genRecoveryPhraseRoute, verifyRecoveryPhraseRoute } from '../common'
import { color } from '../common/styles/constant'
import type {
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState,
} from './type-backup'
import { generateRecoveryPhrase } from './backup-store'
import {
  RECOVERY_PHRASE_CLOSE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_BUTTON_TITLE,
} from './backup-constants'
import styles from './styles'
import { getBackupPassPhrase } from '../store/store-selector'

const { height } = Dimensions.get('window')
const closeImage = require('../images/iconClose.png')
const transparentBands = require('../images/transparentBands.png')
const textBubble = require('../images/textBubble.png')

export class GenerateRecoveryPhrase extends PureComponent<
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState
> {
  componentDidMount() {
    this.props.generateRecoveryPhrase()
  }

  verifyRecoveryPhrase = () => {
    const { navigation: { navigate, state } } = this.props

    navigate(verifyRecoveryPhraseRoute, {
      recoveryPassphrase: this.props.recoveryPassphrase,
      initialRoute: state.params.initialRoute,
    })
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: <CustomView />,
    headerTitle: <CustomView />,
    headerRight: (
      <CustomView style={[styles.genRecoveryHeader]}>
        <Icon
          medium
          onPress={() => navigation.goBack(null)}
          testID={RECOVERY_PHRASE_CLOSE_TEST_ID}
          iconStyle={[styles.headerCloseIcon]}
          src={closeImage}
        />
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.bg.eleventh.color,
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
    },
    gesturesEnabled: false,
  })

  render() {
    const { navigation: { state } } = this.props
    return (
      <Container style={[styles.genRecovery]} safeArea>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container>
          <CustomView>
            <CustomText
              transparentBg
              numberOfLines={1}
              style={[styles.genRecoveryText]}
            >
              Recovery Phrase Generated
            </CustomText>
          </CustomView>
          <CustomView center>
            <CustomText
              center
              transparentBg
              style={[styles.genRecoveryMessage]}
            >
              This is your recovery phrase. Write it down, and don't share it
              with anyone.
            </CustomText>
          </CustomView>
          <CustomView center>
            <Image source={textBubble} style={[styles.imageIcon]} />
            <CustomView style={[styles.genRecoveryPhraseContainer]}>
              <CustomText transparentBg style={[styles.genRecoveryPhrase]}>
                {this.props.recoveryPassphrase}
              </CustomText>
            </CustomView>
          </CustomView>
          <CustomView center>
            <CustomText
              center
              transparentBg
              style={[styles.genRecoverySecondMessage]}
            >
              You will need this recovery phrase to restore from a backup. Keep
              it safe.
            </CustomText>
          </CustomView>
        </Container>
        <CustomView>
          <CustomView center>
            <CustomText
              transparentBg
              center
              style={[styles.genRecoverySmallMessage]}
            >
              Are you sure you wrote it down?
            </CustomText>
          </CustomView>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            onPress={this.verifyRecoveryPhrase}
            testID={SUBMIT_RECOVERY_PHRASE_TEST_ID}
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.eleventh.color,
              fontWeight: '600',
              fontSize: 18,
            }}
            title={SUBMIT_RECOVERY_PHRASE_BUTTON_TITLE}
          />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store, props: ReactNavigation) => {
  return {
    recoveryPassphrase: getBackupPassPhrase(state),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ generateRecoveryPhrase }, dispatch)

export default StackNavigator({
  [genRecoveryPhraseRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(
      GenerateRecoveryPhrase
    ),
  },
})
