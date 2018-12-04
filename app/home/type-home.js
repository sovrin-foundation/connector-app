// @flow
import type { ReactNavigation } from '../common/type-common'
import type {
  ConnectionStore,
  Connection,
} from '../store/type-connection-store'

export type BubbleProps = {
  size: number,
  image: ?string,
  testID: string,
  senderName: string,
  senderDID: string,
  radius: number,
  identifier: string,
  disableTaps: boolean,
  disableTopView: () => void,
  allowInteractions: boolean,
  showBadge: boolean,
} & ReactNavigation

export type BubbleState = {
  failed: boolean,
}

export type BubblesProps = {
  connections: Array<Connection>,
  height: number,
  unSeenMessages: {
    [string]: [string],
  },
} & ReactNavigation

export type HomeProps = {
  connections: ConnectionStore,
  unSeenMessages: {
    [string]: [string],
  },
} & ReactNavigation

export type HomeState = {
  // Don't have react-native Animated API type definition
  scrollY: any,
}

export type ConnectionBubblesState = {
  disableTaps: boolean,
  interactionsDone: boolean,
}
