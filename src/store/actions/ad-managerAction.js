import { AD_MANAGER, AD_MANAGER_SUCCESS } from './action_type'
import { AdmanagerApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let adManager = () => ({ type: AD_MANAGER })
export let adManagerSuccess = data => ({
  type: AD_MANAGER_SUCCESS,
  payload: { data },
})

export function fetchAdManagerData() {
  return async dispatch => {
    dispatch(adManager())
    const response = await AdmanagerApi()
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data.data
        dispatch(adManagerSuccess(data))
      } else if (response.status === 200 && response.data.status === 0) {
        let data = []
        dispatch(adManagerSuccess(data))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}