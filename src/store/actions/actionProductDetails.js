import { PRODUCT_DETAILS, PRODUCT_DETAILS_SUCCESS } from './action_type'
import { ProductDetailsApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let productsDetails = () => ({ type: PRODUCT_DETAILS })
export let productsDetailsSuccess = data => ({
  type: PRODUCT_DETAILS_SUCCESS,
  payload: { data },
})

export function fetchProductsDetailsData(productId) {
  return async (dispatch) => {
    dispatch(productsDetails())
    let response = await ProductDetailsApi(productId)
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data.data
        dispatch(productsDetailsSuccess(data))
      } else if (response.status === 200 && response.data.status === 0) {
        let data = []
        dispatch(productsDetailsSuccess(data))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}