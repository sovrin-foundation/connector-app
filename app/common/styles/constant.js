// @flow
import { StyleSheet } from 'react-native'
import { Dimensions, Platform } from 'react-native'

// TODO:KS Add support for themes as well
// Color name taken from http://www.htmlcsscolor.com/
const zircon = '#ebebea'
export const nightRider = '#333333'
export const grey = '#777777'
export const matterhornSecondary = '#505050'
export const charcoal = '#464646'
export const whiteSmoke = '#f0f0f0'
export const whiteSmokeSecondary = '#f7f7f7'
export const whiteSmokeRGBA = 'rgba(240, 240, 240, 0)'
export const mantis = '#85bf43'
const mantisRGB = '133, 191, 67'
export const greyRGB = '119, 119, 119'
export const white = '#ffffff'
export const whisper = '#EAEAEA'
export const lightDarkBlue = '#4A8FE3'
export const darkGray = '#505050'
export const maroonRed = '#d1021b'

const sirocco = '#636564'
const corduroy = '#3f4140'
const eclipse = '#3f3f3f'
const matterhorn = '#535353'
const blackPearl = '#242b2d'
export const dimGray = '#686868'
const dimGraySecondary = '#6D6D6D'
export const lightGray = '#D8D8D8'
const nobel = '#a0a0a0'
const nobelSecondary = '#9B9B9B'
export const venetianRed = '#d0021b'
export const veniceBlue = '#2A5270'
export const hitSlop = { top: 15, bottom: 15, left: 15, right: 15 }
export const iPhoneXHeight = 812
const dodgerBlue = '#0d8ffc'
const black = '#000000'
const yellowSea = '#EB9B2D'
export const cornFlowerBlue = '#4A90E2'
const atlantis = '#86B93B'
const gamboge = '#DD9012'
const blueViolet = '#8D13FE'
const seaBuckthorn = '#f79347'
const pumpkin = '#F68127'
const olivine = '#97C85F'
const denim = '#1159A9'
const orange = 'rgba(237, 156, 46, 1)'
const orangeDisabled = 'rgba(237, 156, 46, 0.5)'
const darkOrange = 'rgba(207, 127, 20, 1)'
const errorBg = 'rgba(255, 214, 219, 1)'
const darkgray = '#4A4A4A'

// color shades
const primaryShade = '1.0'
const secondaryShade = '0.6'
export const alertCancel = { text: 'Cancel', style: 'cancel' }
export const color = {
  actions: {
    primary: pumpkin,
    secondary: seaBuckthorn,
    tertiary: mantis,
    quaternary: olivine,
    fifth: white,
    sixth: grey,
    eighth: white,
    dangerous: venetianRed,
    none: white,
    button: {
      primary: {
        rgba: greyRGB + ', ' + primaryShade,
        shade: primaryShade,
      },
      secondary: {
        rgba: greyRGB + ', ' + secondaryShade,
        shade: secondaryShade,
      },
    },
    font: {
      primary: white,
      secondary: white,
      tertiary: white,
      quaternary: white,
      fifth: mantis,
      dangerous: white,
      sixth: white,
      seventh: yellowSea,
      eighth: lightDarkBlue,
    },
  },
  bg: {
    primary: {
      color: nightRider,
      font: {
        primary: white,
        secondary: zircon,
        tertiary: nightRider,
      },
    },
    secondary: {
      color: grey,
      font: {
        primary: white,
        secondary: matterhorn,
        tertiary: whiteSmoke,
        quaternary: dodgerBlue,
      },
    },
    tertiary: {
      color: white,
      font: {
        primary: nightRider,
        secondary: dimGray,
        tertiary: grey,
        quaternary: yellowSea,
        fifth: nobelSecondary,
        sixth: dimGraySecondary,
      },
    },
    quaternary: {
      color: mantis,
      font: {
        primary: white,
      },
    },
    fifth: {
      color: white,
      font: {
        primary: grey,
        secondary: zircon,
        tertiary: eclipse,
        fifth: nightRider,
      },
    },
    sixth: {
      color: nightRider,
      font: {
        primary: white,
      },
    },
    seventh: {
      color: whiteSmoke,
      font: {
        primary: nightRider,
        secondary: dimGray,
        tertiary: grey,
        fifth: yellowSea,
        sixth: dimGraySecondary,
        seventh: nobelSecondary,
      },
    },
    eighth: {
      color: orange,
      disabled: orangeDisabled,
      border: {
        color: darkOrange,
      },
    },
    ninth: {
      color: dimGraySecondary,
    },
    tenth: {
      color: errorBg,
      font: {
        color: venetianRed,
      },
    },
    eleventh: {
      color: cornFlowerBlue,
    },
    twelfth: {
      color: atlantis,
    },
    thirteenth: {
      color: gamboge,
    },
    fourteenth: {
      color: blueViolet,
    },
    dark: {
      color: black,
      font: {
        primary: white,
      },
    },
  },
  border: {
    primary: whisper,
    secondary: yellowSea,
  },
  textColor: {
    charcoal: charcoal,
    grey: grey,
    darkgray: darkgray,
  },
}

export const font = {
  size: {
    XS: 12,
    S: 15,
    M: 17,
    M1: 18,
    ML: 20,
    L1: 34,
    L: 40,
    PREFIX: 14,
  },
}

export const PADDING_HORIZONTAL = 15
export const PADDING_VERTICAL = 8
export const MARGIN_BOTTOM = 4
export const OFFSET_1X = 10
export const OFFSET_2X = 20
export const OFFSET_3X = 30
export const OFFSET_4X = 40
export const OFFSET_5X = 50
export const OFFSET_6X = 60
export const OFFSET_7X = 70
export const OFFSET_9X = 90
export const barStyleDark = 'dark-content'
export const barStyleLight = 'light-content'
export const SHADOW_RADIUS = 8
export const HAIRLINE_WIDTH = StyleSheet.hairlineWidth / 2

export const bubbleSize = {
  XS: 40,
  S: 60,
  M: 80,
  L: 100,
  XL: 120,
  XXL: 140,
}

export const PIN_CODE_BORDER_BOTTOM = 4

const { width, height } = Dimensions.get('screen')
export const isiPhone5 = width >= 320 && width < 375
export const SHORT_DEVICE = 600
export const VERY_SHORT_DEVICE = 550
export const errorBoxVerifyPassphraseContainer = height > SHORT_DEVICE ? 60 : 90
export const dangerBannerHeight = height > SHORT_DEVICE ? 64 : 90
export const inputBoxVerifyPassphraseHeight =
  height > SHORT_DEVICE || Platform.OS === 'ios' ? 137 : 40
