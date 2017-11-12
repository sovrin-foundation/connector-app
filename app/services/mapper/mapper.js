// @flow
import { bubbleSize } from '../../common/styles'
import type { Connection } from '../../connection/type-connection'

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}: Connection) => ({
  logoUrl,
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  ...otherArgs,
})
