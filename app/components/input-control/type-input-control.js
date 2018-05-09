// @flow

export type InputControlProps = {
  isValid?: boolean,
  onChangeText: function,
  placeholder: string,
  label: string,
  name: string,
  multiline?: boolean,
  validation?: function,
}
