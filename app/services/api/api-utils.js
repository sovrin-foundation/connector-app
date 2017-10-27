import { SERVER_ERROR_CODE, SERVER_API_CALL_ERROR } from './api-constants'
import { captureError } from '../error/error-handler'

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

export const api = (url, apiOptions, showAlert) =>
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
    .catch(captureError)
    .catch(error => {
      // we don't want to throw JavaScript with simple message
      // we want it to be JSON parse compatible, so that error handlers
      // can parse and use this error
      throw new Error(
        JSON.stringify({
          statusMsg: error.message,
          statusCode: SERVER_API_CALL_ERROR,
        })
      )
    })
