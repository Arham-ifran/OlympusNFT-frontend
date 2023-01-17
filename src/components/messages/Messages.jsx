import { useState, useEffect } from 'react'
import ProfileImage from './../../assets/img/profile.jpeg'
import { connect } from 'react-redux'
import { fetchMessagesThreadsData, fetchMessagesListData } from './../../store/actions/actionMessageThreads'
import { SendMessagesApi, SearchUserApi } from './../../container/Api/api'
import { ErrorHandler, Message } from '../../utils/message'
import { UnixTimestampConvert } from './../../utils/timer'
import { FetchMessagesThreadApi } from './../../container/Api/api'
import Loader from '../loader/Loader';
import SmallLoader from '../loader/SmallLoader'

const $ = window.jQuery
function Messages(props) {

  let userId = localStorage.getItem('id')
  const [selectedUser, setSelectedUser] = useState('')
  const [searchedValue, setSearchedValue] = useState('')
  const [messageHandlerError, setMessageHandlerError] = useState('');
  const [messagesThreadData, setMessagesThreadData] = useState([])
  const [findUser, setFindUser] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false)
  const [loader, setLoader] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [activeClass, setActiveClass] = useState(-1);
  const [rotate, setRotate] = useState(false);
  const [page, setPage] = useState(0)
  const [nextDeny, setNextDeny] = useState(false)
  const [prevDeny, setPrevDeny] = useState(false)

  useEffect(() => {
    fetchMessagesThreads(userId, 10, page)
  }, [page])

  const fetchMessagesThreads = async (id, limit, offset) => {
    await props.dispatch(fetchMessagesThreadsData(id, limit, offset))
  }

  const fetchMessagesList = (id, thread) => {
    props.dispatch(fetchMessagesListData(id, thread))
    // setMessagesListData(props.messageListData)
  }

  let fetchDataForUser = async (value) => {
    setLoader(true)
    let res = await SearchUserApi(value)
    try {
      if (res.data.status === 1) {
        let data = res.data.data[0]
        let filterData = {
          id: data.id,
          thread_id: data.thread_id ? data.thread_id : '',
          profile_image: data.profile_image,
          username: data.username
        }
        setSelectedUser(filterData)
        setLoader(false)
      } else if (res.data.status === 0) {
        setLoader(false)
        let filterData = {
          id: '',
          thread_id: '',
          profile_image: '',
          username: ''
        }
        setSelectedUser(filterData)
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }
  useEffect(() => {
    // debugger
    setMessagesThreadData(props.messageThreadsData)
    if (props.messageThreadsData && Object.keys(props.messageThreadsData).length !== 0) {
      let filtSelectedUser = {
        id: props.messageThreadsData[0].receiverId !== userId ? props.messageThreadsData[0].receiverId : props.messageThreadsData[0].senderId,
        thread_id: props.messageThreadsData[0].id,
        profile_image: props.messageThreadsData[0].receiverId !== userId ? props.messageThreadsData[0].receiverProfileImage : props.messageThreadsData[0].senderProfileImage,
        username: props.messageThreadsData[0].receiverUsername !== props.userData.username ? props.messageThreadsData[0].receiverUsername : props.messageThreadsData[0].senderUsername
      }
      fetchMessagesList(userId, props.messageThreadsData[0].id)
      setSelectedUser(filtSelectedUser)
      setActiveId(props.messageThreadsData[0].id)

      let userProfileUsername = props.match.params.username;
      let userExistingCheck = Boolean(props.match.params.username)
      if (userExistingCheck && props.messageThreadsData) {
        let found = props.messageThreadsData.find(element => element.receiverUsername === userProfileUsername)
        let filterData = found && found !== undefined ? {
          id: found.receiverId !== userId ? found.receiverId : found.senderId,
          thread_id: found.id,
          profile_image: found.receiverId !== userId ? found.receiverProfileImage : found.senderProfileImage,
          username: found.receiverUsername !== props.userData.username ? found.receiverUsername : found.senderUsername
        } : {}
        setSelectedUser(filterData)
        if (Object.keys(filterData).length !== 0) {
          fetchMessagesList(userId, filterData.thread_id)
          setActiveId(filterData.thread_id)
        } else if (Object.keys(filterData).length === 0) {
          fetchDataForUser(userProfileUsername)
        }
      }
    }
    let checkDenyPattern = props.messageThreadsData && Object.keys(props.messageThreadsData).length > 0 ? (props.totalThreads / Object.keys(props.messageThreadsData).length) : 0
    if (checkDenyPattern === 1) {
      setNextDeny(true)
      setPrevDeny(true)
    } else if (checkDenyPattern === 0) {
      setNextDeny(true)
      setPrevDeny(true)
    } else if (checkDenyPattern > 1) {
      setNextDeny(false)
      if (page > 0) {
        setPrevDeny(false)
        let checkDeny = props.totalThreads / (10 * props.threadNumber)
        if (checkDeny > 1) {
          setNextDeny(false)
        } else if (checkDeny < 1) {
          setNextDeny(true)
        }
      }
    }
  }, [props.messageThreadsData, page])

  const handleSearchUser = async (e) => {
    e.preventDefault()
    setSearchUser(e.target.value)
    setSelectedUser('')
    setLoading(x => !x)
    let res = await SearchUserApi(e.target.value)
    try {
      if (res && res.data && res.data.status === 1) {
        setLoading(false)
        setFindUser(res.data.data)
      } else if (res && res.data && res.data.status === 0) {
        setLoading(false)
        setFindUser([])
      }
    }
    catch (err) {
      ErrorHandler(err)
    }
  }

  const handleChangeMessage = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message !== '') {
      setSending(true)
      let body = {
        sender_id: userId,
        receiver_id: selectedUser.id,
        message: message,
        thread_id: selectedUser.thread_id ? selectedUser.thread_id : '',
      }
      let Message_ = {
        id: '',
        message: message,
        receiverId: selectedUser.id,
        senderId: userId,
        senderUsername: props.userData.username,
        receiverUsername: selectedUser.username,
        dateTime: '',
      }
      let res = await SendMessagesApi(body)
      setMessage('');
      try {
        if (res && res.data.status === 1) {
          [...props.messageListData].push(Message_)
          setSending(false)
          let response = await FetchMessagesThreadApi(userId);
          try {
            if (response.data.status === 1) {
              let data = response.data.data;
              setMessagesThreadData(data)
              let filters = data.filter(item => item.receiverId === selectedUser.id)
              let filterData = {
                id: filters[0].receiverId,
                thread_id: filters[0].id,
                profile_image: filters[0].receiverProfileImage,
                username: filters[0].receiverUsername
              }
              setActiveId(filters[0].id)
              setSelectedUser(filterData)
              fetchMessagesList(userId, filters[0].id)
            }
          } catch (err) {
            ErrorHandler(err)
          }
        } else if (res && res.data.status === 0) {
          Message('error', 'Error', `Sorry you can't send message`)
        }
      } catch (err) {
        ErrorHandler(err)
      }
    }
  }

  const handleClickedOnUser = async (item) => {
    if (item.username === props.userData.username) {
      setMessageHandlerError('Please select other user')
      setSelectedUser('')
    } else {
      let filterData = {
        id: item.id,
        thread_id: item.thread_id ? item.thread_id : '',
        profile_image: item.profile_image,
        username: item.username
      }
      fetchMessagesList(userId, item.thread_id)
      setSelectedUser(filterData)
      setMessageHandlerError('')
      setActiveId('')
    }
  }

  const selectMessageHandler = () => {
    if (Object.keys(selectedUser).length !== 0) {
      setSearchUser('')
      $('.add-user').hide();
      $('body').removeClass('modal-open');
      $('body').css('padding-right', '0px');
      $('.modal-backdrop').remove();
    } else if (selectedUser === '') {
      setMessageHandlerError('Please select a user')
    }
  }

  const hanleSelectUserFromThread = async (item) => {
    const filterData = {
      id: item.receiverId !== userId ? item.receiverId : item.senderId,
      thread_id: item.id,
      profile_image: item.receiverUsername !== props.userData.username ? item.receiverProfileImage : item.senderProfileImage,
      username: item.receiverUsername !== props.userData.username ? item.receiverUsername : item.senderUsername
    }
    setSelectedUser(filterData)
    setActiveId(item.id)
    setSearchedValue('')
    fetchMessagesList(userId, item.id)
  }

  const handleChangeSearchedValue = (e) => {
    setSearchedValue(e.target.value)
    let value = e.target.value.toLowerCase()
    if (value !== '') {
      let filters = messagesThreadData.filter(element => element.receiverUsername.toLowerCase().includes(value))
      setMessagesThreadData(filters)
    } else setMessagesThreadData(props.messageThreadsData)
  }

  const handleRefresh = async () => {
    setRotate(x => !x)
    fetchMessagesList(userId, selectedUser.thread_id)
    setTimeout(() => {
      setRotate(x => !x)
    }, 2000);
  }

  let infiniteScroll = () => {
    const wrappedElement = document.getElementById('message');
    if (wrappedElement.scrollHeight - wrappedElement.scrollTop === wrappedElement.clientHeight) {
      // if (document.getElementsByClassName('message').innerHeight + document.getElementsByClassName('message').documentElement.scrollTop === document.getElementsByClassName('message').documentElement.offsetHeight) {
      let newPage = page;
      newPage++;
      setPage(newPage)
    }
  }

  let handleNexThread = () => {
    let newPage = page
    newPage++;
    setPage(newPage)

  }
  let handlePrevThread = () => {
    let newPage = page
    newPage--;
    setPage(newPage)
  }

  if (loader || Object.keys(props.userData).length < 1 || props.loading) {
    return <Loader />
  } return (
    <>
      <div className="main-wrapper main-padding create-store">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="conservation-list">
                <h4>Messages <span className="icon add-new fas fa-comment-medical" data-toggle="modal" data-target=".add-user" /></h4>
                {props.totalThreads > 10 ? <div className='col-sm-12'>
                  {!nextDeny ? <button className='btn btn-sm btn-link float-sm-right' onClick={handleNexThread}>Next</button> : ''}
                  {!prevDeny && page > 0 ? <button className='btn btn-sm btn-link float-sm-left' onClick={handlePrevThread}>Previous</button> : ''}
                </div> : ''}
                <div className="search-bar">
                  <form>
                    <div className="search">
                      <div className="form-group">
                        <span className="icon fa fa-search" />
                        <input type="text" name="search" className="form-control" placeholder="Search User"
                          value={searchedValue} onChange={handleChangeSearchedValue} />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="messages" id='message'>
                  {messagesThreadData && messagesThreadData !== [] ? messagesThreadData.map((item, i) => {
                    return <div className={item.id === activeId ? "message active" : "message"} key={i} onClick={() => hanleSelectUserFromThread(item)}>
                      <div className="image">
                        <img src={item.receiverUsername !== props.userData.username ? item.receiverProfileImage : item.senderProfileImage} alt={item.receiverUsername !== props.userData.username ? item.receiverUsername : item.senderUsername} className="img-fluid" />
                      </div>
                      <div className="detail">
                        <span><b>{item.receiverUsername !== props.userData.username ? item.receiverUsername : item.senderUsername}</b></span><br />
                        <span>{item.lastMessage}</span>
                      </div>
                    </div>
                  }) : <div className="message"></div>}
                </div>
              </div>
            </div>
            <div className="col-md-8">
              {!props.listLoading ? <div className="message-detail">
                <div className="seller-title">
                  <h4>
                    <div className="image">
                      <img src={selectedUser !== '' ? selectedUser.profile_image : ProfileImage} alt={selectedUser.username} className="img-fluid" />
                    </div>
                    {selectedUser !== '' && selectedUser.username !== props.userData.username ? selectedUser.username : 'No User'}
                    {selectedUser.thread_id !== '' ?
                      <div className='float-right mr-3' onClick={handleRefresh}>
                        <span className={rotate ? "icon fas fa-sync-alt rotate-45" : 'icon fas fa-sync-alt'} /></div> : ''}

                  </h4>
                </div>
                {selectedUser !== '' && selectedUser.thread_id !== "" ? <div className="messages-list">
                  {props.messageListData && props.messageListData !== [] ? props.messageListData.map((item, i) => {
                    // if (item.receiverId === userId && item.senderId === selectedUser.id && item.receiverUsername === props.userData.username) {
                    return <div className={item.senderId === userId && item.senderUsername === props.userData.username ? "item right" : item.receiverId === userId && item.senderId === selectedUser.id && item.receiverUsername === props.userData.username ? 'item left' : ''} key={i}>
                      {item.message} <br /><small style={{ fontSize: '8px' }}>{UnixTimestampConvert(item.dateTime)}</small>
                    </div>
                    // }
                  }) : <div className="item left"></div>}
                  {/* {props.messageListData && props.messageListData !== [] ? props.messageListData.map((item, i) => {
                    if (item.senderId === userId && item.senderUsername === props.userData.username) {
                      return <div className="item right" key={i}>{item.message} <br /><small style={{ fontSize: '8px' }}>{item.dateTime !== '' ? UnixTimestampConvert(item.dateTime) : 'Few seconds ago...'}</small></div>
                    }
                  }) : <div className="item right"></div>} */}
                </div> : <div className="messages-list"></div>}
                <div className="message-box">
                  {selectedUser !== '' ? <div className="form-group">
                    <textarea className="form-control" value={message} onChange={handleChangeMessage} />
                  </div> : <div className="form-group">
                    <textarea className="form-control" disabled />
                  </div>}
                  {selectedUser !== '' ? <button className="send-icon" onClick={!sending ? handleSendMessage : () => { }}>{sending ? '...' : <span className=" fas fa-paper-plane" />}</button>
                    : <button className="send-icon" disabled><span className="fas fa-paper-plane" /></button>}
                </div>
              </div> : <div className="message-detail">
                <div className="seller-title">
                  <h4><div className="image">
                    <img alt="" className="img-fluid" /></div>No User Found</h4>
                </div>
                <div className="messages-list">
                </div>
                <div className="message-box">
                  <div className="form-group">
                    <textarea className="form-control"></textarea>
                  </div>
                  <button className="send-icon" disabled><span className=" fas fa-paper-plane"></span></button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
      {/* User Find MOdal */}
      <div className="modal fade add-user" tabIndex={-1} role="dialog" id="myLargeModalLabel" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Lookup a user</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="find-user">
                <form>
                  <div className="form-group">
                    <input type="text" className="form-control" value={searchUser} onChange={handleSearchUser} />
                  </div>
                  <div className='d-flex align-items-center justify-content-center'>
                    {loading ? <div className='col-md-6'>
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div> : ''}
                  </div>
                  <br />
                  <div className='d-flex align-items-center justify-content-center'>
                    <div className="user-list">
                      {findUser !== [] ? findUser.map((item, i) => {
                        return <div className={i === activeClass ? 'user active' : 'user'} key={i} onClick={() => {
                          handleClickedOnUser(item)
                          setActiveClass(i)
                        }}>
                          <div className="image">
                            <img src={item.profile_image} alt={item.username} className="img-fluid" />
                          </div>
                          <div className="detail">
                            <span><b>{item.username}</b></span><br />
                            {/* <span>Default</span> 'No decision taken yet'*/}
                          </div>
                        </div>
                      }) : ''}
                    </div>
                  </div>
                </form>
                <button className="btn-default" onClick={selectMessageHandler}>Message</button>
                <br />
                {messageHandlerError ? <div className='alert alert-danger'>{messageHandlerError}</div> : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = state => {
  return {
    loading: state.MessagesReducer.loading,
    listLoading: state.MessagesReducer.listLoading,
    messageThreadsData: state.MessagesReducer.messageThreadsData,
    totalThreads: state.MessagesReducer.totalThreads,
    threadNumber: state.MessagesReducer.threadNumber,
    messageListData: state.MessagesReducer.messageListData,
    userData: state.userReducer.userData,
  }
}
export default connect(mapStateToProps)(Messages)