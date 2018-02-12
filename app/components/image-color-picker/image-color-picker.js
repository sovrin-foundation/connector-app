// @flow
import React, { PureComponent } from 'react'
import { WebView } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updateConnectionTheme } from '../../store'
import type { ImagePickerProps, ImagePickerStates } from './type-color-picker'
import { color } from '../../common/styles/constant'
import { captureError } from '../../services/error/error-handler'
import { canvasHtml } from './canvas-html'

export class ImageColorPicker extends PureComponent<
  ImagePickerProps,
  ImagePickerStates
> {
  state = {
    imageBlob: '',
  }

  getImage = async (imageUrl: string) => {
    try {
      await RNFetchBlob.fetch('GET', imageUrl)
        .then(res => {
          this.setState({ imageBlob: res.base64() })
        })
        .catch(e => {
          captureError(e)
        })
    } catch (e) {
      captureError(e)
    }
  }

  onBridgeMessage = (message: any) => {
    let messageData = JSON.parse(message.nativeEvent.data)
    if (
      messageData.message === 'rgbValues' &&
      this.state.imageBlob &&
      messageData.payload[0]
    ) {
      const imageColor = Object.values(messageData.payload[0])
      // ignore white color
      const whiteColorPalette = {
        ['255,255,255,255']: '255,255,255,255',
        ['255,255,254,255']: '255,255,254,255',
      }

      if (!whiteColorPalette[imageColor.join(',')]) {
        const primaryColor = `rgba(${imageColor.join(',')})`
        const secondaryColor = `rgba(${imageColor.splice(0, 3).join(',')},
        ${color.actions.button.secondary.shade})`

        this.props.updateConnectionTheme(
          this.props.imageUrl,
          primaryColor,
          secondaryColor
        )
      }
    }
  }

  render() {
    let { imageType = 'jpeg', imageUrl } = this.props
    this.getImage(imageUrl)

    return (
      <WebView
        source={{ html: canvasHtml(this.state.imageBlob, imageType) }}
        javaScriptEnabled={true}
        onMessage={this.onBridgeMessage}
      />
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateConnectionTheme,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(ImageColorPicker)
