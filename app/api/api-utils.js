// @flow
import { SERVER_ERROR_CODE, SERVER_API_CALL_ERROR } from './api-constants'
import { captureError } from '../services/error/error-handler'
import type { CustomError } from '../common/type-common'
import type { ApiData, BackendError } from './type-api'

export const options = (
  method: string = 'GET',
  body: ?{ [string]: any } = null
) => {
  let data: ApiData = {
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

export const api = (
  url: string,
  apiOptions: ApiData,
  showAlert: boolean = false
) =>
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
          .catch((error: Error) => ({
            // our api call was successful,
            // however server did not return any json response
            // Ideally server should send such response with status code 204
            // so that we don't try to parse response for such methods.
            // As of now just send an empty payload signalling that call went fine
            payload: {},
          }))
      } else {
        // Fail with error code if status code is above 300
        return res.text().then((response: string) => ({
          error: response,
        }))
      }
    })
    .then(response => {
      // if response contains payload and no error, that means we got success
      if (response.payload && !response.error) {
        return response.payload
      } else {
        let errorResponse: CustomError = {
          message: response.error,
          code: SERVER_ERROR_CODE,
        }

        try {
          // try to convert error response to json, if it fails that means
          // we did not get error code and message
          const backendError = (JSON.parse(response.error): BackendError)
          errorResponse = {
            message: backendError.statusMsg,
            code: backendError.statusCode,
          }
        } catch (e) {
          // since we did not get error code and message
          // let's just use default that we assigned above,
          // we don't need to do anything here
        }

        throw new Error(JSON.stringify(errorResponse))
      }
    })
    // .catch(captureError) Commenting this for now, it is not returning errors back to saga as of now, Fix this
    .catch((e: Error) => {
      // we don't want to throw JavaScript with simple message
      // we want it to be JSON parse compatible, so that error handlers
      // can parse and use this error
      // Here we are handling network and other http status code errors
      let error = {
        message: e.message,
        code: SERVER_API_CALL_ERROR,
      }

      try {
        // if we already converted JavaScript error to CustomError
        // then pass through same error
        error = JSON.parse(e.message)
      } finally {
      }

      throw new Error(JSON.stringify(error))
    })
