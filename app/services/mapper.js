// @flow
import { bubbleSize } from '../common/styles'

export const stringToLower = (str: String) => str.toLowerCase()

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}: {
  logoUrl: string,
  size: number,
  name?: ?string,
  [string]: any,
}) => ({
  logoUrl,
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  ...otherArgs,
})
