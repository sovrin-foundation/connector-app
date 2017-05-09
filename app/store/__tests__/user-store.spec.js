import userReducer, {
  getUserInfo,
  getUserInfoFailed,
  getUserInfoSuccess
} from "../user-store";

describe("user info should update correctly", () => {
  let initialState = {};

  beforeAll(() => {
    // get initial state without any action
    initialState = userReducer(undefined, { type: "NOACTION" });
  });

  it("should reflect user info request started", () => {
    const expectedState = {
      ...initialState,
      isFetching: true,
      isPristine: false
    };
    const actualState = userReducer(initialState, getUserInfo());

    expect(actualState).toMatchObject(expectedState);
  });

  it("should reflect user info received", () => {
    const data = { name: "test user" };
    const expectedState = {
      ...initialState,
      data
    };
    const actualState = userReducer(initialState, getUserInfoSuccess(data));

    expect(actualState).toMatchObject(expectedState);
  });

  it("should reflect user info failed", () => {
    const error = { code: "1234", message: "User info fetch failed" };
    const expectedState = {
      ...initialState,
      error
    };
    const actualState = userReducer(initialState, getUserInfoFailed(error));

    expect(actualState).toMatchObject(expectedState);
  });
});
