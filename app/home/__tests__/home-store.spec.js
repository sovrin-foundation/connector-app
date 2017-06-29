import homeReducer, {
  enroll,
  enrollSuccess,
  enrollFailure,
} from '../home-store'
import { getKeyPairFromSeed, randomSeed } from '../../services/keys'
import bs58 from 'bs58'

describe('user enrollment should work fine', () => {
  let initialState = {}

  beforeAll(() => {
    initialState = homeReducer(undefined, { type: 'NOACTION' })
  })

  it('should sent enroll request properly', () => {
    expectedState = {
      ...initialState,
      enrollResponse: {
        ...initialState.enrollResponse,
        isFetching: true,
        isPristine: false,
      },
    }

    const phoneNumber = (Math.random() * 1000000000000000000)
      .toString()
      .substring(0, 10)
    const id = randomSeed(32).substring(0, 22)
    const seed = randomSeed(32).substring(0, 32)
    let { publicKey: verKey } = getKeyPairFromSeed(seed)
    verKey = bs58.encode(verKey)
    const pushComMethod = 'dehVox1KRqM:APA91bFWrJea1avml_ELw2MaH60abydtest'
    const device = {
      phoneNumber,
      id,
      verKey,
      pushComMethod,
    }
    const actualState = homeReducer(initialState, enroll(device))
    expect(actualState).toMatchObject(expectedState)
  })

  it('should return enroll success', () => {
    const data = { status: 200 }
    expectedState = {
      ...initialState,
      enrollResponse: {
        ...initialState.enrollResponse,
        isFetching: false,
        data,
      },
    }

    const actualState = homeReducer(initialState, enrollSuccess(data))
    expect(actualState).toMatchObject(expectedState)
  })

  it('should return enroll fail', () => {
    const error = 'enroll failed'
    expectedState = {
      ...initialState,
      enrollResponse: {
        ...initialState.enrollResponse,
        isFetching: false,
        error,
      },
    }

    const actualState = homeReducer(initialState, enrollFailure(error))
    expect(actualState).toMatchObject(expectedState)
  })
})
