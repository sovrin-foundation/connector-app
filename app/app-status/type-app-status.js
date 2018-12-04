// @flow
export type AppStatusState = {
  appState: ?string,
}

export type AppStatusProps = {
  getUnacknowledgedMessages: () => void,
}
