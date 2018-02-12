//@flow
import React, { PureComponent } from 'react'
import { TouchableHighlight, Image, StyleSheet, TextInput } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Container, CustomView, CustomText } from '../components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Store } from '../store/type-store'
import { FooterActions } from '../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_6X,
  OFFSET_7X,
} from '../common/styles'
import { switchEnvironmentRoute, lockSelectionRoute } from '../common'
import { changeEnvironment, disableDevMode } from '../store'
import type {
  SwitchEnvironmentState,
  SwitchEnvironmentProps,
} from './type-switch-environment'

const styles = StyleSheet.create({
  TextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: OFFSET_1X,
    marginBottom: OFFSET_2X,
  },
  label: {
    marginHorizontal: OFFSET_1X,
  },
})

class SwitchEnvironment extends PureComponent<
  SwitchEnvironmentProps,
  SwitchEnvironmentState
> {
  state = {
    agencyDID: '',
    agencyVerificationKey: '',
    agencyUrl: '',
    poolConfig: '',
  }

  onSave = () => {
    const {
      agencyDID,
      agencyVerificationKey,
      agencyUrl,
      poolConfig,
    } = this.state

    this.props.changeEnvironment(
      agencyUrl,
      agencyDID,
      agencyVerificationKey,
      poolConfig
    )
    this.props.navigation.goBack(null)
  }

  onCancel = () => {
    this.props.navigation.goBack(null)
  }

  componentDidMount() {
    const {
      agencyDID,
      agencyUrl,
      agencyVerificationKey,
      disableDevMode,
      poolConfig,
    } = this.props
    disableDevMode()
    this.setState({ agencyDID, agencyUrl, agencyVerificationKey, poolConfig })
  }

  render() {
    const testID = 'switch-environment'
    return (
      <Container>
        <Container>
          <CustomText
            h7
            uppercase
            bold
            bg="tertiary"
            transparentBg
            style={styles.label}
          >
            {'Agency URL'}
          </CustomText>
          <TextInput
            style={styles.TextInput}
            onChangeText={agencyUrl => this.setState({ agencyUrl })}
            value={this.state.agencyUrl}
            testID="text-input-agencyUrl"
          />
          <CustomText
            h7
            uppercase
            bold
            bg="tertiary"
            transparentBg
            style={styles.label}
          >
            {'Agency DID'}
          </CustomText>
          <TextInput
            style={styles.TextInput}
            onChangeText={agencyDID => this.setState({ agencyDID })}
            value={this.state.agencyDID}
            testID="text-input-agencyDID"
          />
          <CustomText
            h7
            uppercase
            bold
            bg="tertiary"
            transparentBg
            style={styles.label}
          >
            {'Agency VerKey'}
          </CustomText>
          <TextInput
            style={styles.TextInput}
            onChangeText={agencyVerificationKey =>
              this.setState({ agencyVerificationKey })
            }
            value={this.state.agencyVerificationKey}
            testID="text-input-agencyVerificationKey"
          />
          <CustomText
            h7
            uppercase
            bold
            bg="tertiary"
            transparentBg
            style={styles.label}
          >
            {'Pool Config'}
          </CustomText>
          <TextInput
            style={styles.TextInput}
            onChangeText={poolConfig => this.setState({ poolConfig })}
            value={this.state.poolConfig}
            testID="text-input-poolConfig"
          />
        </Container>
        <FooterActions
          onAccept={this.onSave}
          onDecline={this.onCancel}
          denyTitle="Cancel"
          acceptTitle="Save"
          testID={`${testID}-footer`}
        />
      </Container>
    )
  }
}

const mapStateToProps = ({ config }: Store) => {
  return {
    agencyUrl: config.agencyUrl,
    agencyDID: config.agencyDID,
    agencyVerificationKey: config.agencyVerificationKey,
    poolConfig: config.poolConfig,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeEnvironment,
      disableDevMode,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(SwitchEnvironment)
