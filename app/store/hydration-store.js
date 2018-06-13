// @flow
import { takeLatest, call, put } from 'redux-saga/effects'
import { AsyncStorage } from 'react-native'
import { getItem, deleteItem } from '../services/secure-storage'
import { updatePushToken } from '../push-notification/push-notification-store'
import {
  hydrateConnections,
  hydrateThemes,
  removePersistedThemes,
} from '../store/connections-store'
import { hydrateClaimMapSaga } from '../claim/claim-store'
import {
  WALLET_ENCRYPTION_KEY,
  CONNECTIONS,
  PUSH_COM_METHOD,
  IS_CONSUMER_AGENT_ALREADY_CREATED,
  CLAIM_MAP,
  USE_VCX_KEY,
} from '../common'
import { TOUCHID_STORAGE_KEY } from '../lock/type-lock'
import type { CustomError } from '../common/type-common'
import {
  HYDRATE_APP,
  HYDRATE_APP_FAIL,
  HYDRATE_APP_SUCCESS,
  hydrationInitialState as initialState,
} from './type-hydration-store'
import type {
  HydrationStoreAction,
  HydrationStore,
} from './type-hydration-store'
import {
  hydrateUserStoreSaga,
  removePersistedUserSelectedAvatarImage,
} from './user/user-store'
import {
  hydrateWalletStoreSaga,
  deletePersistedWalletBalance,
  deletePersistedWalletAddresses,
  deletePersistedWalletHistory,
} from '../wallet/wallet-store'
import { STORAGE_KEY_USER_ONE_TIME_INFO } from './user/type-user-store'
import { STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL } from './type-config-store'
import { HISTORY_EVENT_STORAGE_KEY } from '../connection-history/type-connection-history'
import {
  removePersistedSerializedClaimOffersSaga,
  hydrateSerializedClaimOffersSaga,
} from '../claim-offer/claim-offer-store'

export const hydrateApp = (isAlreadyInstalled: boolean) => ({
  type: HYDRATE_APP,
  isAlreadyInstalled,
})

export const hydrateAppSuccess = () => ({
  type: HYDRATE_APP_SUCCESS,
})

export const hydrateAppFail = (error: CustomError) => ({
  type: HYDRATE_APP_FAIL,
  error,
})

export function* deleteStoredData(): Generator<*, *, *> {
  yield call(deleteItem, WALLET_ENCRYPTION_KEY)
  yield call(deleteItem, CONNECTIONS)
  yield call(AsyncStorage.removeItem, IS_CONSUMER_AGENT_ALREADY_CREATED)
  yield call(deleteItem, STORAGE_KEY_USER_ONE_TIME_INFO)
  yield call(AsyncStorage.removeItem, STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL)
  yield call(deleteItem, CLAIM_MAP)
  yield call(deleteItem, HISTORY_EVENT_STORAGE_KEY)
  yield call(AsyncStorage.removeItem, USE_VCX_KEY)
  try {
    yield* deletePersistedWalletBalance()
  } catch (e) {
    //TODO handle catch
  }
  try {
    yield* deletePersistedWalletAddresses()
  } catch (e) {
    //TODO handle catch
  }
  try {
    yield* deletePersistedWalletHistory()
  } catch (e) {
    //TODO handle catch
  }
  yield* removePersistedUserSelectedAvatarImage()
  yield* removePersistedThemes()
  yield* removePersistedSerializedClaimOffersSaga()
}

export function* appHydration(action: {
  isAlreadyInstalled: boolean,
}): Generator<*, *, *> {
  try {
    let connections = {}
    if (action.isAlreadyInstalled) {
      // app was already installed and user is just opening the app again
      // or waking up from background
      const token = yield call(getItem, PUSH_COM_METHOD)
      yield put(updatePushToken(token))

      let fetchedConnections = yield call(getItem, CONNECTIONS)
      connections = fetchedConnections ? JSON.parse(fetchedConnections) : {}
    } else {
      // this is the fresh installation of app
      // delete previous stored connections
      yield* deleteStoredData()
    }
    yield* hydrateWalletStoreSaga()
    yield put(hydrateConnections(connections))
    yield* hydrateThemes()
    yield* hydrateUserStoreSaga()

    // restore claimMap
    yield* hydrateClaimMapSaga()
    yield* hydrateSerializedClaimOffersSaga()
    yield put(hydrateAppSuccess())
  } catch (e) {
    yield put(hydrateAppFail(e))
  }
}

export default function hydration(
  state: HydrationStore = initialState,
  action: HydrationStoreAction
) {
  switch (action.type) {
    case HYDRATE_APP:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
      }
    case HYDRATE_APP_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case HYDRATE_APP_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      }
    default:
      return state
  }
}
