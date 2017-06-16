const agencyBaseUrl = 'https://agency.evernym.com'
const callCenterBaseUrl = 'https://cua.culedger.com'

export const enrollUser = device => {
  return fetch(callCenterBaseUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  })
}

export const sendUserInfo = userInfo => {
  return fetch(`${callCenterBaseUrl}/agent/app-context`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  })
}

export const sendAuthRequest = ({ identifier, dataBody }) => {
  return fetch(`${agencyBaseUrl}/agent/id/${identifier}/auth`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  })
}
