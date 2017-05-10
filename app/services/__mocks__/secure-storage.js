let secureStorage = {
  ConnectMeKeyChain: {},
}

export const setItem = (key, data) => {
  secureStorage['ConnectMeKeyChain'][key] = data
}

export const getItem = key =>
  Promise.resolve(secureStorage['ConnectMeKeyChain'][key])

export const deleteItem = key => delete secureStorage['ConnectMeKeyChain'][key]
