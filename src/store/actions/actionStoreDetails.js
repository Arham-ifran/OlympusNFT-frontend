import { STORE_DETAILS, STORE_DETAILS_SUCCESS } from './action_type'
import { StoreDetailsApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let storeDetails = () => ({ type: STORE_DETAILS })
export let storeDetailsSuccess = data => ({
  type: STORE_DETAILS_SUCCESS,
  payload: { data },
})

export function fetchStoresDetailsData(storeId) {
  return async (dispatch) => {
    dispatch(storeDetails())
    let response = await StoreDetailsApi(storeId)
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data.data
        dispatch(storeDetailsSuccess(data))
      } else if (response.status === 200 && response.data.status === 0) {
        dispatch(storeDetailsSuccess())
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}