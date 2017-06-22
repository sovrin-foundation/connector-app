export const enrollUser = (device, { callCenterUrl }) => {
  return fetch(`${callCenterUrl}/agent/enroll`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  })
}

export const sendUserInfo = (userInfo, { callCenterUrl }) => {
  return fetch(`${callCenterUrl}/agent/app-context`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  })
}

export const sendAuthRequest = ({ identifier, dataBody }, { agencyUrl }) => {
  return fetch(`${agencyUrl}/agent/id/${identifier}/auth`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  })
}
