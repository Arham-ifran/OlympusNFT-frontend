import * as actions from './action_type'
import { UserProfileApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'

export let userProfileData = () => ({ type: actions.USER_PROFILE_RECORD })
export let userProfileDataSuccess = data => ({
	type: actions.USER_PROFILE_RECORD_SUCCESS,
	payload: { data },
})
export let userUpdateToken = (token, id) => ({
	type: actions.USER_UPDATE_AUTH,
	payload: { token, id },
})

export let userLogoutAction = () => ({ type: actions.USER_REMOVE_AUTH })

export function fetchUserProfileData() {
	return async (dispatch) => {
		dispatch(userProfileData())
		let response = await UserProfileApi()
		try {
			if (response.status === 200 && response.data.status === 1) {
				let data = response.data.data
				dispatch(userProfileDataSuccess(data))
			} else if (response.status === 200 && response.data.status === 0) {
				let data = []
				dispatch(userProfileDataSuccess(data))
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}
}

export let ethereumPriceToggler = state => ({
	type: actions.ETH_PRICE_TOGGEL,
	payload: { state },
})

export const connectWalletFromHeader = value => ({
	type: actions.CONNECT_WALLET,
	payload: { value }
})
export const disconnectWalletFromHeader = value => ({
	type: actions.DISCONNECT_WALLET,
	payload: { value }
})


export let selectedUserType = (value) => ({ type: actions.USER_TYPE, payload: { value } })