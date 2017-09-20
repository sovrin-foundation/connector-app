// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { claimOfferShown } from '../store'
import { Container, CustomView, CustomButton, CustomText } from '../components'
import { homeRoute } from '../common/'

export class ClaimOffer extends PureComponent {
  close = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this.props.claimOfferShown()
  }

  render() {
    return (
      <Container>
        <Container center>
          <CustomText primary>Claim Offer details go here</CustomText>
        </Container>
        <CustomView row>
          <Container>
            <CustomButton
              secondary
              raised
              title="Ignore"
              onPress={this.close}
            />
          </Container>
          <Container>
            <CustomButton primary raised title="Accept" onPress={this.close} />
          </Container>
        </CustomView>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ claimOfferShown }, dispatch)

export default connect(null, mapDispatchToProps)(ClaimOffer)
