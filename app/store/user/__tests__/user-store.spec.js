// @flow
import { put, call, select, take } from 'redux-saga/effects'
import RNFetchBlob from 'react-native-fetch-blob'

import userReducer, {
  connectRegisterCreateAgentDone,
  hydrateUserStoreFail,
  saveUserOneTimeInfoFail,
  hydrateUserStore,
  hydrateUserStoreSaga,
  saveUserOneTimeInfoSaga,
  saveUserSelectedAvatarSaga,
  saveUserSelectedAvatar,
  saveUserSelectedAvatarSuccess,
  saveUserSelectedAvatarFail,
  persistUserSelectedAvatar,
  hydrateUserSelectedAvatarImage,
  selectUserAvatarSaga,
  selectUserAvatarFail,
} from '../user-store'
import { initialTestAction } from '../../../common/type-common'
import {
  userOneTimeInfo,
  userAvatarImagePath,
  userAvatarImageName,
  defaultUUID,
} from '../../../../__mocks__/static-data'
import {
  ERROR_PARSE_USER_INFO_FAIL,
  ERROR_SAVE_USER_INFO_FAIL,
  STORAGE_KEY_USER_ONE_TIME_INFO,
  STORAGE_KEY_USER_AVATAR_NAME,
  ERROR_HYDRATE_USER_SELECTED_IMAGE,
  ERROR_SAVE_USER_SELECTED_IMAGE,
  ERROR_SELECT_USER_AVATAR,
} from '../type-user-store'
import {
  secureSet,
  secureGet,
  safeSet,
  safeGet,
} from '../../../services/storage'
import { getUserAvatarName } from '../../store-selector'
import { uuid } from '../../../services/uuid'
import ImagePicker from 'react-native-image-crop-picker'
import { VCX_INIT_SUCCESS } from '../../type-config-store'

jest.mock('../../../services/uuid')

describe('store: user-store: ', () => {
  let initialState

  beforeEach(() => {
    // get initial state without any action
    initialState = userReducer(undefined, initialTestAction())
  })

  it('action: CONNECT_REGISTER_CREATE_AGENT_DONE', () => {
    expect(
      userReducer(initialState, connectRegisterCreateAgentDone(userOneTimeInfo))
    ).toMatchSnapshot()
  })

  it('action: PARSE_USER_ONE_TIME_INFO_FAIL', () => {
    expect(
      userReducer(
        initialState,
        hydrateUserStoreFail(ERROR_PARSE_USER_INFO_FAIL)
      )
    ).toMatchSnapshot()
  })

  it('action: SAVE_USER_ONE_TIME_INFO_FAIL', () => {
    expect(
      userReducer(
        initialState,
        saveUserOneTimeInfoFail(ERROR_SAVE_USER_INFO_FAIL)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_USER_STORE', () => {
    expect(
      userReducer(initialState, hydrateUserStore({ userOneTimeInfo }))
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_USER_STORE: avatarName', () => {
    expect(
      userReducer(
        initialState,
        hydrateUserStore({ avatarName: userAvatarImageName })
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_USER_STORE, after user one time info is hydrated', () => {
    const afterUserOneTimeInfoState = userReducer(
      initialState,
      hydrateUserStore({ userOneTimeInfo })
    )
    expect(
      userReducer(
        afterUserOneTimeInfoState,
        hydrateUserStore({ avatarName: userAvatarImageName })
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_USER_STORE, after avatar name is hydrated', () => {
    const afterAvatarNameState = userReducer(
      initialState,
      hydrateUserStore({ avatarName: userAvatarImageName })
    )
    expect(
      userReducer(afterAvatarNameState, hydrateUserStore({ userOneTimeInfo }))
    ).toMatchSnapshot()
  })

  it('saga: saveUserOneTimeInfoSaga => success', () => {
    const gen = saveUserOneTimeInfoSaga(
      connectRegisterCreateAgentDone(userOneTimeInfo)
    )
    expect(gen.next().value).toEqual(take(VCX_INIT_SUCCESS))
    expect(gen.next().value).toEqual(
      call(
        secureSet,
        STORAGE_KEY_USER_ONE_TIME_INFO,
        JSON.stringify(userOneTimeInfo)
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: saveUserOneTimeInfoSaga => fail', () => {
    const gen = saveUserOneTimeInfoSaga(
      connectRegisterCreateAgentDone(userOneTimeInfo)
    )
    expect(gen.next().value).toEqual(take(VCX_INIT_SUCCESS))
    expect(gen.next().value).toEqual(
      call(
        secureSet,
        STORAGE_KEY_USER_ONE_TIME_INFO,
        JSON.stringify(userOneTimeInfo)
      )
    )

    const errorMessage = 'No storage available'
    expect(gen.throw(new Error(errorMessage)).value).toEqual(
      put(
        saveUserOneTimeInfoFail({
          code: ERROR_SAVE_USER_INFO_FAIL.code,
          message: `${ERROR_SAVE_USER_INFO_FAIL.message}${errorMessage}`,
        })
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserStoreSaga => success', () => {
    const gen = hydrateUserStoreSaga()
    expect(gen.next().value).toEqual(
      call(secureGet, STORAGE_KEY_USER_ONE_TIME_INFO)
    )
    expect(gen.next(JSON.stringify(userOneTimeInfo)).value).toEqual(
      put(hydrateUserStore({ userOneTimeInfo }))
    )
    expect(gen.next().value).toEqual(
      call(safeGet, STORAGE_KEY_USER_AVATAR_NAME)
    )
    expect(gen.next(userAvatarImageName).value).toEqual(
      put(hydrateUserStore({ avatarName: userAvatarImageName }))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserStoreSaga => fail', () => {
    const gen = hydrateUserStoreSaga()
    expect(gen.next().value).toEqual(
      call(secureGet, STORAGE_KEY_USER_ONE_TIME_INFO)
    )
    const error = 'test error'
    expect(gen.throw(new Error(error)).value).toEqual(
      put(
        hydrateUserStoreFail({
          code: ERROR_PARSE_USER_INFO_FAIL.code,
          message: `${ERROR_PARSE_USER_INFO_FAIL.message}${error}`,
        })
      )
    )
    expect(gen.next().value).toEqual(
      call(safeGet, STORAGE_KEY_USER_AVATAR_NAME)
    )
    const errorMessage = 'test error in storage key'
    expect(gen.throw(new Error(errorMessage)).value).toEqual(
      put(hydrateUserStoreFail(ERROR_HYDRATE_USER_SELECTED_IMAGE(errorMessage)))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: saveUserSelectedAvatarSaga => success', () => {
    const gen = saveUserSelectedAvatarSaga(
      saveUserSelectedAvatar(userAvatarImagePath)
    )
    const userAvatarAppPath = `${
      RNFetchBlob.fs.dirs.DocumentDir
    }/${userAvatarImageName}`
    expect(gen.next().value).toEqual(select(getUserAvatarName))
    expect(gen.next(userAvatarImageName).value).toEqual(
      call(RNFetchBlob.fs.exists, userAvatarAppPath)
    )
    expect(gen.next(true).value).toEqual(
      call(RNFetchBlob.fs.unlink, userAvatarAppPath)
    )
    const newImageName = `${defaultUUID}.jpeg`
    const newImagePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${newImageName}`
    expect(gen.next().value).toEqual(
      call(RNFetchBlob.fs.cp, userAvatarImagePath, newImagePath)
    )
    expect(gen.next().value).toEqual(
      call(safeSet, STORAGE_KEY_USER_AVATAR_NAME, newImageName)
    )
    expect(gen.next().value).toEqual(
      put(saveUserSelectedAvatarSuccess(newImageName))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: saveUserSelectedAvatarSaga => failure', () => {
    const gen = saveUserSelectedAvatarSaga(
      saveUserSelectedAvatar(userAvatarImagePath)
    )
    const userAvatarAppPath = `${
      RNFetchBlob.fs.dirs.DocumentDir
    }/${userAvatarImageName}`
    expect(gen.next().value).toEqual(select(getUserAvatarName))
    expect(gen.next(userAvatarImageName).value).toEqual(
      call(RNFetchBlob.fs.exists, userAvatarAppPath)
    )
    expect(gen.next(true).value).toEqual(
      call(RNFetchBlob.fs.unlink, userAvatarAppPath)
    )
    const newImageName = `${defaultUUID}.jpeg`
    const newImagePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${newImageName}`
    expect(gen.next().value).toEqual(
      call(RNFetchBlob.fs.cp, userAvatarImagePath, newImagePath)
    )
    const errorMessage = 'error while copying image'
    expect(gen.throw(new Error(errorMessage)).value).toEqual(
      put(
        saveUserSelectedAvatarFail(ERROR_SAVE_USER_SELECTED_IMAGE(errorMessage))
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: persistUserSelectedAvatar', () => {
    const gen = persistUserSelectedAvatar(userAvatarImageName)
    expect(gen.next().value).toEqual(
      call(safeSet, STORAGE_KEY_USER_AVATAR_NAME, userAvatarImageName)
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserSelectedAvatarImage => success', () => {
    const gen = hydrateUserSelectedAvatarImage()
    expect(gen.next().value).toEqual(
      call(safeGet, STORAGE_KEY_USER_AVATAR_NAME)
    )
    expect(gen.next(userAvatarImageName).value).toEqual(
      put(hydrateUserStore({ avatarName: userAvatarImageName }))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserSelectedAvatarImage => failure', () => {
    const gen = hydrateUserSelectedAvatarImage()
    expect(gen.next().value).toEqual(
      call(safeGet, STORAGE_KEY_USER_AVATAR_NAME)
    )
    const errorMessage = 'error getting user avatar name'
    expect(gen.throw(new Error(errorMessage)).value).toEqual(
      put(hydrateUserStoreFail(ERROR_HYDRATE_USER_SELECTED_IMAGE(errorMessage)))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: selectUserAvatarSaga => success', () => {
    const gen = selectUserAvatarSaga()
    expect(gen.next().value).toEqual(
      call(ImagePicker.openPicker, { mediaType: 'photo' })
    )
    expect(gen.next({ path: userAvatarImagePath }).value).toEqual(
      put(saveUserSelectedAvatar(userAvatarImagePath))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: selectUserAvatarSaga => failure', () => {
    const gen = selectUserAvatarSaga()
    expect(gen.next().value).toEqual(
      call(ImagePicker.openPicker, { mediaType: 'photo' })
    )
    const errorMessage = 'image picker user cancelled'
    const error = new Error(errorMessage)
    expect(gen.throw(error).value).toEqual(
      put(selectUserAvatarFail(ERROR_SELECT_USER_AVATAR(errorMessage)))
    )
    expect(gen.next().done).toBe(true)
  })
})
