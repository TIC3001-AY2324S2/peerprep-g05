export const types = {
    SET_USER_INFO: 'main/setUserInfo',
    SET_TOKEN: 'main/setToken',
    SET_IS_VERIFY_DONE: 'main/setIsVerifyDone',
    SET_IS_INIT_LOADING: 'main/setIsLoading',
};

export const actions = {
    setUserInfo: (payload) => ({ type: types.SET_USER_INFO, payload }),
    setToken: (payload) => ({ type: types.SET_TOKEN, payload }),
    setIsVerifyDone: (payload) => ({ type: types.SET_IS_VERIFY_DONE, payload }),
    setIsLoading: (payload) => ({ type: types.SET_IS_INIT_LOADING, payload }),
};

export const initialState = {
    userInfo: {},
    isLoading: false,
    isVerifyDone: false,
    token: null,
};

export const selectors = {
    getUserInfo: (state) => state.main.userInfo,
    getIsVerifyDone: (state) => state.main.isVerifyDone,
    getIsLoading: (state) => state.main.isLoading,
    getToken: (state) => state.main.token,
};

export function mainReducer(state = initialState, action) {
    const { payload } = action;
    switch (action.type) {
        case types.SET_USER_INFO:
            return {
                ...state,
                userInfo: payload,
            };
        case types.SET_IS_VERIFY_DONE:
            return {
                ...state,
                isVerifyDone: payload,
            };
        case types.SET_IS_INIT_LOADING:
            return {
                ...state,
                isLoading: payload,
            };
        case types.SET_TOKEN:
            return {
                ...state,
                token: payload,
            };
        default:
            return state;
    }
}
