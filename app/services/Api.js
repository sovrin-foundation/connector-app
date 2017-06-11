const agencyBaseUrl = 'https://agency.evernym.com/agent'
const callCenterBaseUrl = 'https://callcenter.evernym.com/agent'

export const enroll = device => {
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

export const poll = identifier =>
  fetch(`${agencyBaseUrl}/id/${identifier}/auth`, {
    mode: 'cors',
  })
    .then(res => {
      if (res.status == 200) {
        return res.json()
      } else {
        throw new Error('Bad Request')
      }
    })
    .then(resData => resData.status)
    .catch(error => error)

export const sendAppContext = context => {
  return fetch(`${callCenterBaseUrl}/app-context`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(context),
  })
}

export const sendAuthRequest = ({ identifier, dataBody }) => {
  return fetch(`https://agency.evernym.com/agent/id/${identifier}/auth`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  })
}
