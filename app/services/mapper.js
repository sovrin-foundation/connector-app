import { bubbleSize } from '../common/styles'

export const stringToLower = str => str.toLowerCase()

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}) => ({
  image: logoUrl ? { uri: logoUrl } : require('../images/cb_evernym.png'),
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  ...otherArgs,
})
