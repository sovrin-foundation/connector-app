// @flow
import { put, takeLatest, call, all, select, take } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker'

import {
  secureSet,
  secureGet,
  safeSet,
  safeGet,
  safeDelete,
} from '../../services/storage'
import {
  CONNECT_REGISTER_CREATE_AGENT_DONE,
  HYDRATE_USER_STORE,
  STORAGE_KEY_USER_ONE_TIME_INFO,
  SAVE_USER_ONE_TIME_INFO_FAIL,
  ERROR_SAVE_USER_INFO_FAIL,
  ERROR_PARSE_USER_INFO_FAIL,
  PARSE_USER_ONE_TIME_INFO_FAIL,
  SAVE_USER_SELECTED_AVATAR,
  USER_AVATAR_IMAGE_NAME,
  ERROR_SAVE_USER_SELECTED_IMAGE,
  SAVE_USER_SELECTED_AVATAR_FAIL,
  SAVE_USER_SELECTED_AVATAR_SUCCESS,
  STORAGE_KEY_USER_AVATAR_NAME,
  ERROR_HYDRATE_USER_SELECTED_IMAGE,
  SELECT_USER_AVATAR,
  SELECT_USER_AVATAR_FAIL,
  ERROR_SELECT_USER_AVATAR,
} from './type-user-store'
import type {
  UserStore,
  UserStoreAction,
  UserOneTimeInfo,
  ConnectRegisterCreateAgentDoneAction,
  SaveUserSelectedAvatarAction,
  HydrateUserStoreData,
} from './type-user-store'
import type { CustomError } from '../../common/type-common'
import { RESET } from '../../common/type-common'
import { uuid } from '../../services/uuid'
import { getUserAvatarName } from '../../store/store-selector'
import { VCX_INIT_SUCCESS } from '../type-config-store'

const initialState = {
  isFetching: false,
  error: null,
  userOneTimeInfo: null,
  avatarName: null,
}

export const connectRegisterCreateAgentDone = (
  userOneTimeInfo: UserOneTimeInfo
) => ({
  type: CONNECT_REGISTER_CREATE_AGENT_DONE,
  userOneTimeInfo,
})

export const saveUserOneTimeInfoFail = (error: CustomError) => ({
  type: SAVE_USER_ONE_TIME_INFO_FAIL,
  error,
})

export function* saveUserOneTimeInfoSaga(
  action: ConnectRegisterCreateAgentDoneAction
): Saga<void> {
  const { userOneTimeInfo } = action
  try {
    // we know that user one time info is only created once
    // also this saga will only run while we are calling
    // vcx_init, that saga raises this action
    // so we can assume that when vcxInitSuccess Saga raises this action
    // then we can safely call secureSet
    // Ideally, we should run walletInitSuccess Saga inside all secure*
    // api calls, so that those APIs that needs only wallet access
    // has that wallet handle inside vcx and that should work
    yield take(VCX_INIT_SUCCESS)
    yield call(
      secureSet,
      STORAGE_KEY_USER_ONE_TIME_INFO,
      JSON.stringify(userOneTimeInfo)
    )
  } catch (e) {
    // we need to add some fallback if user storage is not available
    // or is full or if user deleted our data
    yield put(
      saveUserOneTimeInfoFail({
        code: ERROR_SAVE_USER_INFO_FAIL.code,
        message: `${ERROR_SAVE_USER_INFO_FAIL.message}${e.message}`,
      })
    )
  }
}

function* watchConnectRegisterCreateAgent(): any {
  yield takeLatest(CONNECT_REGISTER_CREATE_AGENT_DONE, saveUserOneTimeInfoSaga)
}

export const hydrateUserStore = (data: HydrateUserStoreData) => ({
  type: HYDRATE_USER_STORE,
  data,
})

export const hydrateUserStoreFail = (error: CustomError) => ({
  type: PARSE_USER_ONE_TIME_INFO_FAIL,
  error,
})

export function* hydrateUserStoreSaga(): Generator<*, *, *> {
  try {
    const userOneTimeInfoJson: string = yield call(
      secureGet,
      STORAGE_KEY_USER_ONE_TIME_INFO
    )
    if (userOneTimeInfoJson) {
      const userOneTimeInfo: UserOneTimeInfo = JSON.parse(userOneTimeInfoJson)
      yield put(hydrateUserStore({ userOneTimeInfo }))
    }
  } catch (e) {
    yield put(
      hydrateUserStoreFail({
        code: ERROR_PARSE_USER_INFO_FAIL.code,
        message: `${ERROR_PARSE_USER_INFO_FAIL.message}${e.message}`,
      })
    )
  }

  yield* hydrateUserSelectedAvatarImage()
}

export const saveUserSelectedAvatar = (imagePath: string) => ({
  type: SAVE_USER_SELECTED_AVATAR,
  imagePath,
})

export const saveUserSelectedAvatarSuccess = (avatarName: string) => ({
  type: SAVE_USER_SELECTED_AVATAR_SUCCESS,
  avatarName,
})

export const saveUserSelectedAvatarFail = (error: CustomError) => ({
  type: SAVE_USER_SELECTED_AVATAR_FAIL,
  error,
})

export function getImageInfo(imagePath: string) {
  const parts = imagePath.split('/')
  const fileName = parts[parts.length - 1]
  const nameParts = fileName.split('.')
  return {
    name: nameParts[0],
    extension: nameParts[nameParts.length - 1],
  }
}

export function* saveUserSelectedAvatarSaga(
  action: SaveUserSelectedAvatarAction
): Generator<*, *, *> {
  const { imagePath } = action
  const { name, extension } = getImageInfo(imagePath)
  try {
    const appDirectory = RNFetchBlob.fs.dirs.DocumentDir
    const existingAvatarName = yield select(getUserAvatarName)
    const userAvatarPath = `${appDirectory}/${existingAvatarName}`
    const alreadyExist = yield call(RNFetchBlob.fs.exists, userAvatarPath)

    const imageId = uuid()
    const avatarName = `${imageId}.${extension}`
    const newImagePath = `${appDirectory}/${avatarName}`

    if (alreadyExist) {
      yield call(RNFetchBlob.fs.unlink, userAvatarPath)
    }

    yield call(RNFetchBlob.fs.cp, imagePath, newImagePath)
    yield* persistUserSelectedAvatar(avatarName)
    yield put(saveUserSelectedAvatarSuccess(avatarName))
  } catch (e) {
    yield put(
      saveUserSelectedAvatarFail(ERROR_SAVE_USER_SELECTED_IMAGE(e.message))
    )
  }
}

export function* persistUserSelectedAvatar(
  userAvatarName: string
): Generator<*, *, *> {
  yield call(safeSet, STORAGE_KEY_USER_AVATAR_NAME, userAvatarName)
}

export function* hydrateUserSelectedAvatarImage(): Generator<*, *, *> {
  try {
    const avatarName = yield call(safeGet, STORAGE_KEY_USER_AVATAR_NAME)
    if (avatarName) {
      yield put(
        hydrateUserStore({
          avatarName,
        })
      )
    }
  } catch (e) {
    yield put(
      hydrateUserStoreFail(ERROR_HYDRATE_USER_SELECTED_IMAGE(e.message))
    )
  }
}

export function* removePersistedUserSelectedAvatarImage(): Generator<*, *, *> {
  // TODO:KS User avatar should be moved inside wallet
  // either in zip or inside wallet
  // we need to store user avatar, so that on restore user sees same avatar
  yield call(safeDelete, STORAGE_KEY_USER_AVATAR_NAME)
}

export function* watchSaveUserSelectedAvatar(): any {
  yield takeLatest(SAVE_USER_SELECTED_AVATAR, saveUserSelectedAvatarSaga)
}

export const selectUserAvatar = () => ({
  type: SELECT_USER_AVATAR,
})

export const selectUserAvatarFail = (error: CustomError) => ({
  type: SELECT_USER_AVATAR_FAIL,
  error,
})

export function* selectUserAvatarSaga(): Generator<*, *, *> {
  try {
    const image = yield call(ImagePicker.openPicker, {
      mediaType: 'photo',
    })
    yield put(saveUserSelectedAvatar(image.path))
  } catch (e) {
    // TODO:KS Don't know what to do if image is not picked
    // or we get some error, there is no UI to communicate these errors
    yield put(selectUserAvatarFail(ERROR_SELECT_USER_AVATAR(e.message)))
  }
}

export function* watchSelectUserAvatar(): any {
  yield takeLatest(SELECT_USER_AVATAR, selectUserAvatarSaga)
}

export function* watchUserStore(): any {
  yield all([
    watchConnectRegisterCreateAgent(),
    watchSaveUserSelectedAvatar(),
    watchSelectUserAvatar(),
  ])
}

export default function user(
  state: UserStore = initialState,
  action: UserStoreAction
) {
  switch (action.type) {
    case CONNECT_REGISTER_CREATE_AGENT_DONE:
      return {
        ...state,
        userOneTimeInfo: action.userOneTimeInfo,
      }
    case PARSE_USER_ONE_TIME_INFO_FAIL:
      return {
        ...state,
        error: action.error,
      }
    case SAVE_USER_ONE_TIME_INFO_FAIL:
      return {
        ...state,
        error: action.error,
      }
    case HYDRATE_USER_STORE: {
      // HYDRATE_USER_STORE can be fired more than once, it can be called
      // a. when user one time info is fetched from storage
      // b. when user avatar image is fetched from storage
      // in any case, we want to keep previous state if one of the param is missing
      const {
        userOneTimeInfo = state.userOneTimeInfo,
        avatarName = state.avatarName,
      } = action.data

      return {
        ...state,
        userOneTimeInfo,
        avatarName,
      }
    }
    case RESET:
      return initialState
    case SAVE_USER_SELECTED_AVATAR_SUCCESS:
      return {
        ...state,
        avatarName: action.avatarName,
      }
    case SAVE_USER_SELECTED_AVATAR_FAIL:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}
