// @flow
import React, { PureComponent } from 'react'
import { WebView } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImageResizer from 'react-native-image-resizer'

import { updateConnectionTheme } from '../../store'
import type { ImagePickerProps, ImagePickerStates } from './type-color-picker'
import { color } from '../../common/styles/constant'
import { captureError } from '../../services/error/error-handler'
import { canvasHtml } from './canvas-html'

const whiteColorPalette = {
  ['255,255,255,255']: '255,255,255,255',
  ['255,255,254,255']: '255,255,254,255',
}

export function isAllowedColor(color: Array<*>): boolean {
  return !whiteColorPalette[color.join(',')]
}

export class ImageColorPicker extends PureComponent<
  ImagePickerProps,
  ImagePickerStates
> {
  state = {
    imageBlob: '',
  }

  getImage = async (imageUrl: string) => {
    try {
      const localCopy = await RNFetchBlob.config({ fileCache: true }).fetch(
        'GET',
        imageUrl
      )
      const resizedImage = await ImageResizer.createResizedImage(
        localCopy.path(),
        20,
        20,
        'JPEG',
        80
      )
      const base64EncodedImage = await RNFetchBlob.fs.readFile(
        resizedImage.path,
        'base64'
      )
      this.setState({ imageBlob: base64EncodedImage })
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
      const { payload } = messageData
      const firstBestColor = Object.values(payload[0])
      const secondBestColor =
        payload.length > 1 ? Object.values(payload[1]) : []

      let imageColor = firstBestColor

      if (!isAllowedColor(firstBestColor)) {
        if (isAllowedColor(secondBestColor)) {
          imageColor = secondBestColor
        }
      }

      if (isAllowedColor(imageColor)) {
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

  componentDidMount() {
    this.getImage(this.props.imageUrl)
  }

  render() {
    let { imageType = 'jpeg' } = this.props

    if (!this.state.imageBlob) {
      return null
    }

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
