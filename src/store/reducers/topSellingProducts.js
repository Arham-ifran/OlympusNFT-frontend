import * as actions from '../actions/action_type'
let initialState = {
    data: [],
    loading: true,
};

let topSellingProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.TOP_SELLING_PRODUCTS:
            return { ...state }
        case actions.TOP_SELLING_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.data
            }
        default:
            return state
    }
}


export default topSellingProductsReducer;