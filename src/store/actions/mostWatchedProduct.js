

import { MOST_WATCHED_PRODUCT, MOST_WATCHED_PRODUCT_SUCCESS } from './action_type'
import { API } from './../../utils'
export let mostWatchedProduct = () => ({ type: MOST_WATCHED_PRODUCT })
export let mostWatchedProductSuccess = data => ({
  type: MOST_WATCHED_PRODUCT_SUCCESS,
  payload: { data },
})

export function fetchMostWatchedProductData() {
  return dispatch => {
    dispatch(mostWatchedProduct())
    API.get('api/most-watched-products')
      .then(response => {
        if (response.status === 200 && response.data.status === 1) {
          let data = response.data.data
          dispatch(mostWatchedProductSuccess(data))
        } else if (response.status === 200 && response.data.status === 0) {
          let data = []
          dispatch(mostWatchedProductSuccess(data))
        }
      }).catch(err => err ? dispatch(mostWatchedProduct()) : '')
  }
}