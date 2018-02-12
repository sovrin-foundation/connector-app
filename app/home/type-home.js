// @flow
import type { ReactNavigation } from '../common/type-common'
import type { Connection } from '../connection/type-connection'

export type BubbleProps = {
  size: number,
  image: ?string,
  testID: string,
  senderName: string,
  senderDID: string,
} & ReactNavigation

export type BubbleState = {
  failed: boolean,
}

export type BubblesProps = {
  connections: Array<Connection>,
  height: number,
} & ReactNavigation

export type HomeProps = {}
