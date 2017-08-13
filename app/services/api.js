import { SERVER_ERROR_CODE } from '../common/api-constants'

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
  return fetch(`${agencyUrl}/agent/token/${token}/connection`, {
    mode: 'cors',
  })
    .then(res => {
      // TODO:KS create common method to return successful
      // and unsuccessful api response
      if (res.status >= 200 && res.status < 300) {
        return res.json().then(response => ({
          payload: response,
        }))
      } else {
        // Fail with error code if status code is above 300
        return res.text().then(response => ({
          error: response,
        }))
      }
    })
    .then(response => {
      // if response contains payload and no error, that means we got success
      if (response.payload && !response.error) {
        return response.payload
      } else {
        let errorResponse = {
          statusMsg: 'Server error',
          statusCode: SERVER_ERROR_CODE,
        }

        try {
          // try to convert error response to json, if it fails that means
          // we did not get error code and message
          errorResponse = JSON.parse(response.error)
        } finally {
          // since we did not get error code and message
          // let's just use default that we assigned above,
          // we don't need to do anything here
        }

        throw new Error(JSON.stringify(errorResponse))
      }
    })
}

export const sendInvitationConnectionRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
  token,
}) => {
  return fetch(`${agencyUrl}/agent/token/${token}/connection`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  })
}

export const sendAuthenticationRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
}) => {
  return fetch(`${agencyUrl}/agent/id/${identifier}/auth`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody),
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res.status
    } else {
      throw new Error('Bad Request')
    }
  })
}

export const sendQRInvitationResponse = ({ data, config: { agencyUrl } }) => {
  return fetch(`${agencyUrl}/agent/connection`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      challenge: data.challenge,
      signature: data.signature,
    }),
  })
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        try {
          return res.json()
        } catch (e) {
          return {}
        }
      } else {
        res.text().then(console.error)
        throw new Error('QR invitation response failed')
      }
    })
    .catch()
}
