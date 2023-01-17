import * as actions from '../actions/action_type'
let initialState = {
  itemData: {},
  loading: true,
  items: []
};

let storeDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.STORE_DETAILS:
      return { ...state, loading: true, itemData: {}, items: [] }
    case actions.STORE_DETAILS_SUCCESS:
      return {
        ...state,
        itemData: action.payload.data,
        items: action.payload.data.items,
        loading: false,
      }
    default:
      return state
  }
}


export default storeDetailsReducer;