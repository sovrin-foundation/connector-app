const options = (method, body) => {
  return {
    method,
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

export const enrollUser = (device, { callCenterUrl }) => {
  return fetch(`${callCenterUrl}/agent/enroll`, options('POST', device))
}

export const sendUserInfo = (userInfo, { callCenterUrl }) => {
  return fetch(`${callCenterUrl}/agent/app-context`, options('POST', userInfo))
}

export const sendAuthRequest = ({ identifier, dataBody }, { agencyUrl }) => {
  return fetch(
    `${agencyUrl}/agent/id/${identifier}/auth`,
    options('PUT', dataBody)
  )
}
