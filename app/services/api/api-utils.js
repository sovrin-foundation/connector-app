import { SERVER_ERROR_CODE } from '../../common/api-constants'

export const options = (method = 'GET', body) => {
  let data = {
    method,
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
  if (body) {
    data.body = JSON.stringify(body)
  }

  return data
}

// TODO: Write common code for API calling
export const api = (url, apiOptions) =>
  fetch(url, apiOptions)
    .then(res => {
      // TODO:KS create common method to return successful
      // and unsuccessful api response
      if (res.status >= 200 && res.status < 300) {
        return res
          .json()
          .then(response => ({
            payload: response,
          }))
          .catch(error => ({
            // our api call was successful,
            // however server did not return any json response
            // Ideally server should send such response with status code 204
            // so that we don't try to parse response for such methods.
            // As of now just send an empty payload signalling that call went fine
            payload: {},
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
