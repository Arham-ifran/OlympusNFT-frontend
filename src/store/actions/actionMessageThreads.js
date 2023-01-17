import { MESSAGE_THREADS, MESSAGE_THREADS_SUCCESS, MESSAGE_LIST, MESSAGE_LIST_SUCCESS, MESSAGE_THREADS_NUMBER } from './action_type'
import { FetchMessagesThreadApi, FetchMessagesListApi } from './../../container/Api/api'
import { ErrorHandler } from '../../utils/message'
export let messagesThreads = () => ({ type: MESSAGE_THREADS })
export let messagesThreadsSuccess = (data, number) => ({
  type: MESSAGE_THREADS_SUCCESS,
  payload: { data, number },
})

export function fetchMessagesThreadsData(user_id, limit = 10, offset = 0) {
  return async (dispatch) => {
    dispatch(messagesThreads())
    let response = await FetchMessagesThreadApi(user_id, limit, offset)
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data
        let threadNumber = offset + 1;
        dispatch(messagesThreadsSuccess(data, threadNumber))
      } else if (response.status === 200 && response.data.status === 0) {
        let data = []
        dispatch(messagesThreadsSuccess(data, offset))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}

export let messagesList = () => ({ type: MESSAGE_LIST })
export let messagesListSuccess = data => ({
  type: MESSAGE_LIST_SUCCESS,
  payload: { data },
})

export function fetchMessagesListData(user_id, thread_id) {
  return async (dispatch) => {
    dispatch(messagesList())
    let response = await FetchMessagesListApi(user_id, thread_id)
    try {
      if (response.status === 200 && response.data.status === 1) {
        let data = response.data.data
        dispatch(messagesListSuccess(data))
      } else if (response.status === 200 && response.data.status === 0) {
        let data = []
        dispatch(messagesListSuccess(data))
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
}