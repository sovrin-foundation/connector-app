// TODO:KS Add support for themes as well
const zircon = '#ebebea'
const white = '#ffffff'
const mantis = '#85bf43'
const sirocco = '#636564'
const corduroy = '#3f4140'
const matterhorn = '#535353'
const grey = '#757575'
const blackPearl = '#242b2d'
const dimGray = '#686868'
const nobel = '#a0a0a0'
const venetianRed = '#d0021b'

export const color = {
  actions: {
    primary: mantis,
    secondary: sirocco,
    tertiary: nobel,
    dangerous: venetianRed,
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
      },
    },
    tertiary: {
      color: zircon,
      font: {
        primary: blackPearl,
        secondary: dimGray,
      },
    },
    quarternary: {
      color: nobel,
      font: {
        primary: zircon,
      },
    },
  },
}

export const font = {
  size: {
    XS: 12,
    S: 14,
    M: 16,
    ML: 17,
    L: 27,
    XL: 30,
    XXL: 44,
  },
}

export const PADDING_HORIZONTAL = 15
export const PADDING_VERTICAL = 8
export const MARGIN_BOTTOM = 4
