import * as actions from '../actions/action_type'
let initialState = {
  data: [],
  loading: true,
};

let productsByCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PRODUCTS_BY_CATEGORY:
      return { ...state }
    case actions.PRODUCTS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }
    default:
      return state
  }
}


export default productsByCategoryReducer;