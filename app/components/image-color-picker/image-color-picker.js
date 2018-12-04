// @flow
import React, { PureComponent } from 'react'
import { WebView, Platform } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImageResizer from 'react-native-image-resizer'

import { updateConnectionTheme } from '../../store/connections-store'
import type { ImagePickerProps, ImagePickerStates } from './type-color-picker'
import { color, greyRGB } from '../../common/styles/constant'
import { captureError } from '../../services/error/error-handler'
import { canvasHtml } from './canvas-html'
import { getColor } from '../../bridge/react-native-cxs/RNCxs'

const LIGHT_COLOR_LUMINANCE_FACTOR = 200

export function isAllowedColor(color: Array<*>): boolean {
  if (color.length < 3) {
    return false
  }

  const [R, G, B] = color

  // As per luminance https://en.wikipedia.org/wiki/Relative_luminance
  const luminance =
    0.2126 * parseInt(R, 10) +
    0.7152 * parseInt(G, 10) +
    0.0722 * parseInt(B, 10)

  // any luminance below this factor is considered dark color
  return luminance < LIGHT_COLOR_LUMINANCE_FACTOR
}

const imageType = {
  jpg: 'JPEG',
  jpeg: 'JPEG',
  png: 'PNG',
  webp: 'WEBP',
}

export function getImageType(imageUrl: string) {
  const parts = imageUrl.split('.')
  const imageExtension = parts[parts.length - 1].toLowerCase()

  return imageType[imageExtension] || imageType.jpg
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
      const type = getImageType(imageUrl)
      const resizedImage = await ImageResizer.createResizedImage(
        localCopy.path(),
        20,
        20,
        type,
        80
      )
      // if we are on Android, then we have a faster native solution
      // to get color from image, so we will use native for Android
      if (Platform.OS === 'android') {
        const rgb = await getColor(resizedImage.path)
        this.updateTheme([rgb])

        return
      }

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
      this.updateTheme(messageData.payload)
    }
  }

  updateTheme = (payload: Array<Array<string>>) => {
    const firstBestColor = Object.values(payload[0])
    const secondBestColor = payload.length > 1 ? Object.values(payload[1]) : []

    let imageColor = greyRGB.split(', ').map(rgb => parseInt(rgb, 10))
    // add alpha value to rgba
    imageColor.push(1)

    if (isAllowedColor(firstBestColor)) {
      imageColor = firstBestColor
    } else if (isAllowedColor(secondBestColor)) {
      imageColor = secondBestColor
    } else {
      const thirdBestColor =
        payload.length > 2 ? Object.values(payload[2]) : imageColor
      if (isAllowedColor(thirdBestColor)) {
        imageColor = thirdBestColor
      }
    }

    const primaryColor = `rgba(${imageColor.join(',')})`
    const secondaryColor = `rgba(${imageColor.splice(0, 3).join(',')},${
      color.actions.button.secondary.shade
    })`

    this.props.updateConnectionTheme(
      this.props.imageUrl,
      primaryColor,
      secondaryColor
    )
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
