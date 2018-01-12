// @flow

export type Item = {
  label: string,
  data?: string,
}

export type CustomListProps = {
  items: Array<Item>,
  type?: string,
}
