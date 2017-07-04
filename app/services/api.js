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
// TODO: Write common code for API calling
const api = (url, apiOptions) => {
  return fetch(url, apiOptions).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res.json()
    } else {
      throw new Error(`API call failed, ${res.status}`)
    }
  })
}

export const enrollUser = (device, { callCenterUrl }) => {
  // TODO: Remove fetch and use api method. Also, do not check status inside store
  return fetch(`${callCenterUrl}/agent/enroll`, options('POST', device))
}

export const sendUserInfo = (userInfo, { callCenterUrl }) => {
  // TODO: Remove fetch and use api method. Also, do not check status inside store
  return fetch(`${callCenterUrl}/agent/app-context`, options('POST', userInfo))
}

export const invitationDetailsRequest = (token, { agencyUrl }) => {
  // TODO: Remove fetch and use api method. Also, do not check status inside store
  return fetch(`${agencyUrl}/agent/token/${token}/connection-req`, {
    mode: 'cors',
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res.json()
    } else {
      throw new Error('Bad Request')
    }
  })
}

export const sendInvitationConnectionRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
  token,
}) => {
  return fetch(`${agencyUrl}/agent/token/${token}/connection-req`, {
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
