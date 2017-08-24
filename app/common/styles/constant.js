// @flow
// TODO:KS Add support for themes as well
// Color name taken from http://www.htmlcsscolor.com/
const zircon = '#ebebea'
export const white = '#ffffff'
export const mantis = '#85bf43'
const sirocco = '#636564'
const corduroy = '#3f4140'
const matterhorn = '#535353'
const grey = '#757575'
const lightGrey = '#f0f0f0'
const darkGrey = '#484848'
const blackPearl = '#242b2d'
const dimGray = '#686868'
const nobel = '#a0a0a0'
const venetianRed = '#d0021b'
const whiteSmoke = '#F2F2F2'
export const veniceBlue = '#2A5270'
const dodgerBlue = '#0d8ffc'
const black = '#000000'

export const color = {
  actions: {
    primary: mantis,
    secondary: sirocco,
    tertiary: nobel,
    dangerous: venetianRed,
    none: white,
  },
  bg: {
    primary: {
      color: corduroy,
      font: {
        primary: white,
        secondary: zircon,
      },
    },
    secondary: {
      color: white,
      font: {
        primary: corduroy,
        secondary: matterhorn,
        tertiary: grey,
        quaternary: dodgerBlue,
      },
    },
    tertiary: {
      color: zircon,
      font: {
        primary: blackPearl,
        secondary: dimGray,
      },
    },
    quaternary: {
      color: nobel,
      font: {
        primary: zircon,
      },
    },
    fifth: {
      color: whiteSmoke,
      font: {
        primary: darkGrey,
      },
    },
    sixth: {
      color: black,
      font: {
        primary: white,
      },
    },
  },
}

export const font = {
  size: {
    XS: 12,
    S: 14,
    M: 17,
    ML: 20,
    L: 27,
    XL: 30,
    XXL: 40,
    XXXL: 44,
  },
}

export const PADDING_HORIZONTAL = 15
export const PADDING_VERTICAL = 8
export const MARGIN_BOTTOM = 4
export const OFFSET_1X = 10
export const OFFSET_2X = 20
export const barStyleDark = 'dark-content'
export const barStyleLight = 'light-content'

export const bubbleSize = {
  XS: 40,
  S: 60,
  M: 80,
  L: 100,
  XL: 120,
  XXL: 140,
}
