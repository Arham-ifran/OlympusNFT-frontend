import * as actions from '../actions/action_type'
let initialState = {
    userData: {},
    loading: true,
    token: '',
    id: '',
    ethPriceState: false,
    userType: '',
    walletConnection: false
};

let userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.USER_PROFILE_RECORD:
            return { ...state }
        case actions.USER_PROFILE_RECORD_SUCCESS:
            return { ...state, userData: action.payload.data, loading: false }
        case actions.USER_UPDATE_AUTH:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('id', action.payload.id);
            return { ...state, token: action.payload.token, id: action.payload.id }
        case actions.USER_REMOVE_AUTH:
            localStorage.clear()
            return { ...state, token: '', id: '' }
        case actions.ETH_PRICE_TOGGEL:
            return { ...state, ethPriceState: action.payload.state }
        case actions.USER_TYPE:
            return { ...state, userType: action.payload.value }
        case actions.CONNECT_WALLET:
            localStorage.setItem('walletConn', true)
            return { ...state, walletConnection: true }
        case actions.DISCONNECT_WALLET:
            localStorage.removeItem('walletConn')
            return { ...state, walletConnection: false }
        default:
            return state
    }
}

export default userReducer;