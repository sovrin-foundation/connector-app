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

export const invitationDetailsRequest = (token, { agencyUrl }) => {
  return fetch(`${agencyUrl}/agent/token/${token}/connection-req`, {
    mode: 'cors',
  }).then(res => {
    if (res.status == 200) {
      return res.json()
    } else {
      throw new Error('Bad Request')
    }
  })
}

export const sendInvitationConnectionRequest = (
  { identifier, dataBody },
  { agencyUrl }
) => {
  return fetch(`${agencyUrl}/token/${token}/connection-req`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  })
}

export const sendAuthenticationRequest = (
  { identifier, dataBody },
  { agencyUrl }
) => {
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
