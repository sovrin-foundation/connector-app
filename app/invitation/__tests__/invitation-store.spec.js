import 'react-native'
import React from 'react'

import invitationReducer, {
  getInvitationDetailsRequest,
  pendingConnectionSuccess,
  pendingConnectionFailure,
} from '../invitation-store'
import { getKeyPairFromSeed, randomSeed } from '../../services/keys'
import bs58 from 'bs58'

describe('user connection request should work fine', () => {
  let initialState = {}

  beforeAll(() => {
    initialState = invitationReducer(undefined, {
      type: 'NONE',
      status: 'NONE',
    })
  })

  it('should sent connection request properly', () => {
    expectedState = {
      ...initialState,
      type: 'PENDING_CONNECTION_REQUEST',
      status: 'NONE',
    }

    const phoneNumber = (Math.random() * 1000000000000000000)
      .toString()
      .substring(0, 10)
    const id = randomSeed(32).substring(0, 22)
    const seed = randomSeed(32).substring(0, 32)
    let { publicKey: verKey } = getKeyPairFromSeed(seed)
    verKey = bs58.encode(verKey)
    const pushComMethod = 'FCM'
    const invitation = {
      id,
      verKey,
      pushComMethod,
    }
    const actualState = invitationReducer(
      initialState,
      getInvitationDetailsRequest('7SyQz6Lp4KknxH9QvJcbEF')
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should return connection success', () => {
    const data = {
      offerMsgTitle: 'Hi John',
      offerMsgText: 'CU ledger wants to connect with you',
      statusMsg: 'offer-sent',
    }
    const type = 'PENDING_CONNECTION_REQUEST'
    expectedState = {
      ...initialState,
      type,
      data,
    }

    const actualState = invitationReducer(
      initialState,
      pendingConnectionSuccess(data, type)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should return connection request fail', () => {
    const error = { code: '1234', message: 'pending connections fetch failed' }
    expectedState = {
      ...initialState,
      error,
    }

    const actualState = invitationReducer(
      initialState,
      pendingConnectionFailure(error)
    )
    expect(actualState).toMatchObject(expectedState)
  })
})
