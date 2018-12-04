// @flow

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Image,
  NativeModules,
  View,
  ScrollView,
  Text,
  Button,
  Platform,
  TextInput,
  Alert,
} from 'react-native'
import type { OnfidoProps, OnfidoState } from './type-onfido'
import type { Store } from '../store/type-store'
import { connect } from 'react-redux'
import { Container, CustomView } from '../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_6X,
  OFFSET_7X,
  dimGray,
  lightGray,
} from '../common/styles'

const logoConnectMe = <Image source={require('../images/logo_connectme.png')} />
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
})

export class Onfido extends PureComponent<OnfidoProps, OnfidoState> {
  onfidoToken = 'test_wSVTpffhcS0014N11jRHoWyQrm_J3DRM'

  constructor(props: OnfidoProps) {
    super(props)
  }

  state = {
    //title: '',
    first_name: '',
    last_name: '',
    //email: '',
    //gender: '',
    dob: '',
    //state: '',
    //country: '',
    //'addresses[][building_number]': '',
    //'addresses[][street]': '',
    //'addresses[][town]': '',
    //'addresses[][postcode]': '',
    //'addresses[][state]': '',
    //'addresses[][country]': '',
  }

  setTextContent(titleContent: string, subtitleContent: string) {
    this.props.contentTitle = titleContent
    this.props.contentSubtitle = subtitleContent
  }

  checkApplicant(applicantId: string) {
    const checks = {
      type: 'express',
      async: 'true',
      'reports[][name]': 'document',
      'reports[][name]': 'facial_similarity',
      'reports[][variant]': 'standard',
    }

    const checkParams = Object.keys(checks)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(checks[key])
      })
      .join('&')

    console.log('Creating applicant with parameters: ', checkParams)

    /**
curl https://api.onfido.com/v2/applicants/<APPLICANT_ID>/checks \
  -H "Authorization: Token token=<YOUR_API_TOKEN>" \
  -d 'type=express' \
  -d 'reports[][name]=document' \
  -d 'reports[][name]=facial_similarity' \
  -d 'reports[][variant]=standard' \
  -d 'async=true'
     */
    let responseStatus = -1

    fetch('https://api.onfido.com/v2/applicants/' + applicantId + '/checks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: 'Token token=' + this.onfidoToken,
      },
      body: checkParams,
    })
      .then(response => {
        responseStatus = response.status
        return response.json()
      })
      .then(jsonBody => {
        console.log('Response body: ', jsonBody)
      })
  }

  launchSDK() {
    const applicantParams = Object.keys(this.state)
      .map(key => {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key])
        )
      })
      .join('&')

    console.log('Creating applicant with parameters: ', applicantParams)

    let responseStatus = -1

    fetch('https://api.onfido.com/v2/applicants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: 'Token token=' + this.onfidoToken,
      },
      body: applicantParams,
    })
      .then(response => {
        responseStatus = response.status
        return response.json()
      })
      .then(jsonBody => {
        console.log('Response body: ', jsonBody)

        //if (responseStatus > 300) {
        if (jsonBody.id && jsonBody.id.length === 36) {
          console.log('Success status: ', responseStatus)

          if (Platform.OS == 'android') {
            NativeModules.OnfidoSDK.startSDK(
              jsonBody.id,
              applicantId => {
                this.setTextContent(
                  'Verification complete',
                  'To perform another verification, press "Launch"'
                )
                this.checkApplicant(jsonBody.id)
              },
              errorCause => {
                this.setTextContent(
                  'Flow not finished',
                  'To try again, press "Launch"'
                )
              }
            )
          } else {
            NativeModules.OnfidoSDK.startSDK(
              jsonBody.id,
              applicationId => {
                this.setTextContent(
                  'Verification complete',
                  'To perform another verification, press "Launch"'
                )
                this.checkApplicant(jsonBody.id)
              },
              errorCause => {
                this.setTextContent(
                  'Flow not finished',
                  'To try again, press "Launch"'
                )
              }
            )
          }
        } else {
          console.log('Error status: ', responseStatus)
          Alert.alert(
            'Status returned: ' + responseStatus,
            JSON.stringify(jsonBody),
            [
              {
                text: 'Ok',
                onPress: () => {},
              },
            ],
            {
              cancelable: false,
            }
          )
        }
      })
      .catch(error => {
        console.log('Response ERROR: ', error)
      })
  }

  render() {
    return (
      <Container tertiary>
        <CustomView center doubleVerticalSpace>
          {logoConnectMe}
        </CustomView>
        <ScrollView>
          <Text style={styles.welcome}>{this.props.contentTitle}</Text>
          <Text style={styles.instructions}>{this.props.contentSubtitle}</Text>
          {/* <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantTitle"
            onChangeText={applicantTitle =>
              this.setState({ title: applicantTitle })
            }
            value={this.state.title}
            underlineColorAndroid="transparent"
            placeholder="Enter your title: i.e. Mr."
          /> */}
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantFirstName"
            onChangeText={applicantFirstName =>
              this.setState({ first_name: applicantFirstName })
            }
            value={this.state.first_name}
            underlineColorAndroid="transparent"
            placeholder="Enter your first name"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantLastName"
            onChangeText={applicantLastName =>
              this.setState({ last_name: applicantLastName })
            }
            value={this.state.last_name}
            underlineColorAndroid="transparent"
            placeholder="Enter your last name"
          />
          {/* <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantEmail"
            onChangeText={applicantEmail =>
              this.setState({ email: applicantEmail })
            }
            value={this.state.email}
            underlineColorAndroid="transparent"
            placeholder="Enter your email address"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantGender"
            onChangeText={applicantGender =>
              this.setState({ gender: applicantGender })
            }
            value={this.state.gender}
            underlineColorAndroid="transparent"
            placeholder="Enter your gender"
          /> */}
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantDOB"
            onChangeText={applicantDOB => this.setState({ dob: applicantDOB })}
            value={this.state.dob}
            underlineColorAndroid="transparent"
            placeholder="Enter your birthdate: i.e. 1981-01-30"
          />
          {/* <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantCountry"
            onChangeText={applicantCountry =>
              this.setState({ country: applicantCountry })
            }
            value={this.state.country}
            underlineColorAndroid="transparent"
            placeholder="Enter your country"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantState"
            onChangeText={applicantState =>
              this.setState({ state: applicantState })
            }
            value={this.state.state}
            underlineColorAndroid="transparent"
            placeholder="Enter your state"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressBuildingNumber"
            onChangeText={applicantAddressBuildingNumber =>
              this.setState({
                'addresses[][building_number]': applicantAddressBuildingNumber,
              })
            }
            value={this.state['addresses[][building_number]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address building number"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressStreet"
            onChangeText={applicantAddressStreet =>
              this.setState({ 'addresses[][street]': applicantAddressStreet })
            }
            value={this.state['addresses[][street]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address street"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressTown"
            onChangeText={applicantAddressTown =>
              this.setState({ 'addresses[][town]': applicantAddressTown })
            }
            value={this.state['addresses[][town]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address town"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressPostcode"
            onChangeText={applicantAddressPostcode =>
              this.setState({
                'addresses[][postcode]': applicantAddressPostcode,
              })
            }
            value={this.state['addresses[][postcode]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address postcode"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressState"
            onChangeText={applicantAddressState =>
              this.setState({ 'addresses[][state]': applicantAddressState })
            }
            value={this.state['addresses[][state]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address state"
          />
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderColor: 'gray',
              borderWidth: 1,
            }}
            testID="text-input-onfidoApplicantAddressCountry"
            onChangeText={applicantAddressCountry =>
              this.setState({ 'addresses[][country]': applicantAddressCountry })
            }
            value={this.state['addresses[][country]']}
            underlineColorAndroid="transparent"
            placeholder="Enter your address country"
          /> */}
          <Button
            onPress={() => this.launchSDK()}
            title="Verify Documents"
            color="#159375"
          />
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({})

export default connect(mapStateToProps)(Onfido)
