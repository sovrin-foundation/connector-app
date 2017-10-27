// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, WebView } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updateConnectionTheme } from '../../store'
import type { ImagePickerProps, ImagePickerStates } from './type-color-picker'
import { color } from '../../common/styles/constant'
import { captureError } from '../../services'

export class ImageColorPicker extends PureComponent<
  void,
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
          // the conversion is done in native code
          this.setState({ imageBlob: res.base64() })
        })
        .catch((errorMessage, statusCode) => {
          captureError(errorMessage)
        })
    } catch (e) {
      captureError(e)
    }
  }

  onBridgeMessage = (message: any) => {
    let payload = JSON.parse(message.nativeEvent.data)
    if (payload.message === 'rgbValues' && this.state.imageBlob) {
      const imageColor = Object.values(payload.payload).join(',')
      const primaryColor = `rgba(${imageColor +
        ',' +
        color.actions.button.primary.shade})`
      const secondaryColor = `rgba(${imageColor +
        ',' +
        color.actions.button.secondary.shade})`

      this.props.updateConnectionTheme(
        this.props.imageUrl,
        primaryColor,
        secondaryColor
      )
    }
  }

  render() {
    let { imageType = 'jpeg', imageUrl } = this.props
    this.getImage(imageUrl)

    const canvasHtml = `
        <!DOCTYPE html>
        <html>
        <script>
        function fetchColorFromCanvas(){
          var rgb = getAverageRGB(document.getElementById("canvasImage"));
          var message = {"message":'rgbValues',"payload":rgb};
          window.postMessage(JSON.stringify(message));
        }
        function getAverageRGB(imgEl) {
          var blockSize = 5;
          var defaultRGB = {r:0,g:0,b:0};
          var canvas = document.createElement("canvas");
          var context = canvas.getContext && canvas.getContext("2d");
          var data, width, height;
          var i = -4;
          var length;
          var rgb = {r:0,g:0,b:0};
          var count = 0;
          if (context == undefined || context == null) {
              return defaultRGB;
          }
          height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
          width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
          context.drawImage(imgEl, 0, 0);
          try {
              data = context.getImageData(width/3, width/3 + 10, width/3, width/3 + 10);
          } catch(e) {
              return defaultRGB;
          }
          length = data.data.length;  
          while ( (i += blockSize * 4) < length ) {
              ++count;
              rgb.r += data.data[i];
              rgb.g += data.data[i+1];
              rgb.b += data.data[i+2];              
          }
          rgb.r = ~~(rgb.r/count);
          rgb.g = ~~(rgb.g/count);
          rgb.b = ~~(rgb.b/count);
          return rgb;
        }
        const interval = setInterval(function() {
          var img = document.getElementById('canvasImage');
          if(img.src.length != 0) {
            fetchColorFromCanvas();
            clearInterval(interval);
          }
        },10);
        </script>
        <body style='position: absolute; bottom: -1000px;'>
          <img src='data:image/${imageType};base64,${this.state
      .imageBlob}' id='canvasImage' onload='fetchColorFromCanvas()'/>
        </body>
        </html>`

    return (
      <WebView
        style={styles.canvas}
        source={{ html: canvasHtml }}
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

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    right: -1000,
  },
})
