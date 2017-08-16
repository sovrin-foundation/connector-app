import { bubbleSize } from '../common/styles'

export function* generatePlaceholderConnection() {
  let index = 0
  const connections = [
    {
      name: 'evernym',
      image: require('../images/cb_evernym.png'),
      size: bubbleSize.XL,
    },
    {
      name: 'edcu',
      image: require('../images/cb_EDCU.png'),
      size: bubbleSize.XL,
    },
  ]
  while (index >= 0) {
    yield connections[index]
    index++
    if (index > 1) index = 0
  }
}

export const stringToLower = str => str.toLowerCase()

export const connectionMapper = ({
  identifier,
  name = 'suncoast',
  logoUrl,
  size = bubbleSize.XL,
  remoteConnectionId,
}) => ({
  identifier,
  name: stringToLower(name.split(' ')[0]),
  image: logoUrl ? { uri: logoUrl } : require('../images/cbSunCoast.png'),
  size,
  fullName: name,
  remoteConnectionId,
})
