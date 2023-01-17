import * as actions from '../actions/action_type'
let initialState = {
  data: [],
  loading: true,
};

let adManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.AD_MANAGER:
      return { ...state }
    case actions.AD_MANAGER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }
    default:
      return state
  }
}


export default adManagerReducer;