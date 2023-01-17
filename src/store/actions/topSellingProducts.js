




import { TOP_SELLING_PRODUCTS, TOP_SELLING_PRODUCTS_SUCCESS } from './action_type'
import { API } from './../../utils'
export let topSellingProducts = () => ({ type: TOP_SELLING_PRODUCTS })
export let topSellingProductsSuccess = data => ({
    type: TOP_SELLING_PRODUCTS_SUCCESS,
    payload: { data },
})

export function fetchtopSellingProductsData() {
    return dispatch => {
        dispatch(topSellingProducts())
        API.get('api/top-selling-products')
            .then(response => {
                
                if (response.status === 200 && response.data.status === 1) {
                    let data = response.data.data
                    dispatch(topSellingProductsSuccess(data))
                } else if (response.status === 200 && response.data.status === 0) {
                    let data = []
                    dispatch(topSellingProductsSuccess(data))
                }
            }).catch(err => err ? dispatch(topSellingProducts()) : '')
    }
}