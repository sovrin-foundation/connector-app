const initialState = {
  isPNAllowed: false,
}

export const PNPermission = isAllowed => ({
  type: 'PN_PERMISSION',
  isAllowed,
})

export default function PNStore(state = initialState, action) {
  switch (action.type) {
    case 'PN_PERMISSION':
      return {
        ...state,
        isPNAllowed: action.isAllowed,
      }
    default:
      return state
  }
}
