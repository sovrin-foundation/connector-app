import detox from 'detox'

const config = require('../package.json').detox

jest.setTimeout(120000)

beforeAll(async () => {
  await detox.init(config)
})

afterAll(async () => {
  await detox.cleanup()
})
