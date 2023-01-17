import * as actions from '../actions/action_type'
let initialState = {
  itemData: {},
  related_product: [],
  loading: true
};

let productDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PRODUCT_DETAILS:
      return { ...state, loading: true, itemData: {}, related_product: [] }
    case actions.PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        itemData: action.payload.data,
        loading: false,
        related_product: action.payload.data.related_product
      }
    default:
      return state
  }
}


export default productDetailsReducer;