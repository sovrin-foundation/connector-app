// @flow

export type IsValid = 'IDLE' | 'SUCCESS' | 'ERROR'

export type InputControlProps = {
  isValid?: IsValid,
  onChangeText: (text: string, name: string) => void,
  placeholder: string,
  label: string,
  name: string,
  multiline?: boolean,
  validation?: () => void,
  maxLength?: number,
}
