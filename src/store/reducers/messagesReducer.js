import * as actions from '../actions/action_type'
let initialState = {
  messageThreadsData: [],
  totalThreads: 0,
  threadNumber: 0,
  loading: true,
  listLoading: true,
  messageListData: []
};

let MessagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MESSAGE_THREADS:
      return { ...state, loading: true, messageThreadsData: [] }
    case actions.MESSAGE_THREADS_SUCCESS:
      return {
        ...state,
        messageThreadsData: action.payload.data.data,
        totalThreads: action.payload.data.total_records,
        threadNumber: action.payload.number,
        loading: false,
      }
    case actions.MESSAGE_LIST:
      return { ...state, listLoading: true, messageListData: [] }
    case actions.MESSAGE_LIST_SUCCESS:
      return {
        ...state,
        messageListData: action.payload.data,
        listLoading: false,
      }
    default:
      return state
  }
}


export default MessagesReducer;