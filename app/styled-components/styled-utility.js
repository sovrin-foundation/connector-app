const sizeMap = {
  large: 100,
  medium: 75,
  small: 50,
  smaller: 30,
  smallest: 20,
}

export const imageWidth = props => sizeMap[props.size] || props.size[0]

export const imageHeight = props => sizeMap[props.size] || props.size[1]

export const borderRadius = props => {
  let bRadius = 0
  if (!isNaN(imageWidth(props))) {
    bRadius = imageWidth(props) / 2
  }
  return bRadius
}

export const flexDirection = props => props.flexDirection || 'row'

export const justifyContent = props => props.justifyContent || 'flex-start'

export const alignItems = props => props.alignItems || 'stretch'

export const alignSelf = props => props.alignSelf || 'auto'
