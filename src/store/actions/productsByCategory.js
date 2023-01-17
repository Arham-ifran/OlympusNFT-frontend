import { PRODUCTS_BY_CATEGORY, PRODUCTS_BY_CATEGORY_SUCCESS } from './action_type'
import { API } from './../../utils'
export let productsByCategory = () => ({ type: PRODUCTS_BY_CATEGORY })
export let productsByCategorySuccess = data => ({
  type: PRODUCTS_BY_CATEGORY_SUCCESS,
  payload: { data },
})

export function fetchProductsByCategoryData(category) {
  let URL = category && category ? `api/products-category/${category}` : `api/products-category`
  return dispatch => {
    dispatch(productsByCategory())
    API.get(URL)
      .then(response => {
        if (response.status === 200 && response.data.status === 1) {
          let data = response.data.data
          dispatch(productsByCategorySuccess(data))
        } else if (response.status === 200 && response.data.status === 0) {
          let data = []
          dispatch(productsByCategorySuccess(data))
        }
      }).catch(err => err ? dispatch(productsByCategory()) : '')
  }
}