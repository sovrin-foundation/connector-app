// @flow

export type IsValid = 'IDLE' | 'SUCCESS' | 'ERROR'

export type InputControlProps = {
  isValid?: IsValid,
  // $flowFixMe
  onChangeText: function,
  placeholder: string,
  label: string,
  name: string,
  multiline?: boolean,
  // $flowFixMe
  validation?: function,
  maxLength?: number,
}
