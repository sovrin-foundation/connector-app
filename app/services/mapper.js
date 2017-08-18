import { bubbleSize } from '../common/styles'

export const stringToLower = str => str.toLowerCase()

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}) => ({
  logoUrl,
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  image: logoUrl ? { uri: logoUrl } : require('../images/cb_evernym.png'),
  ...otherArgs,
})
