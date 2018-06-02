import { Headers, Response, Request } from 'node-fetch'

const fetch = jest.fn(() => {})
fetch.Headers = Headers
fetch.Request = Request
fetch.Response = Response

fetch.mockResponse = (body, init) =>
  fetch.mockImplementation(
    () =>
      new Promise((resolve, reject) =>
        process.nextTick(() => resolve(new Response(body, init)))
      )
  )

fetch.mockResponseOnce = (body, init) =>
  fetch.mockImplementationOnce(
    () =>
      new Promise((resolve, reject) =>
        process.nextTick(() => resolve(new Response(body, init)))
      )
  )

fetch.mockResponses = (...responses) =>
  responses.map(([body, init]) =>
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) =>
          process.nextTick(() => resolve(new Response(body, init)))
        )
    )
  )

export default fetch
