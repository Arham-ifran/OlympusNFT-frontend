import * as actions from '../actions/action_type'
let initialState = {
  data: [],
  loading: true,
};

let mostWatchedProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MOST_WATCHED_PRODUCT:
      return { ...state }
    case actions.MOST_WATCHED_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }
    default:
      return state
  }
}


export default mostWatchedProductReducer;