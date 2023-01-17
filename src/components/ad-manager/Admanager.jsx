import { useState, useEffect } from 'react'
import CreateAdModal from './../modals/CreateAdModal'
import ProfileSideBar from '../profile/ProfileSideBar'
import MyProfile from '../profile/MyProfile'
import { UnixTimestampConvert } from './../../utils/timer'
import { fetchAdManagerData } from './../../store/actions/ad-managerAction'
import { DeleteAdApi } from './../../container/Api/api'
import { connect } from 'react-redux'
import Loader from './../loader/Loader'
import { ErrorHandler, Message } from '../../utils/message'
const $ = window.jQuery;
function Admanager(props) {
  $(window).scrollTop('0');
  const [adsData, setAdsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    props.dispatch(fetchAdManagerData())
  }, [])

  useEffect(() => {
    setLoading(props.loading)
    setAdsData(props.adsData)
  }, [props.adsData])

  const handleDelete = async (id) => {
    let body = { userId: localStorage.getItem('id'), adId: id }
    let filterData = adsData.filter((item) => item.id !== id)
    let res = await DeleteAdApi(body)
    try {
      if (res.data.status === 1) {
        setAdsData(filterData)
        Message('success', 'Success', res.data.message)
      } else if (res.data.status === 0) {
        Message('error', 'Error', res.data.message)
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  if (loading) {
    return <Loader />
  } return (
    <>
      <div className="dashboard-wrapper main-padding current-item">
        <div className="row">
          <ProfileSideBar />
          <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
              <MyProfile /><div className='content-box'>
                <h3>Ad Manager </h3>
                <div className='content'>
                  <a className='btn-default hvr-bounce-in' data-toggle='modal' data-target='.create-ad'><span className='icon fa fa-plus' />Create Ad</a>
                </div>
                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Impressions</th>
                        <th>Total Budget</th>
                        <th>CPC Price</th>
                        <th>Total spent</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adsData && adsData.length > 0 ? adsData.map((item, i) => {
                        return <tr key={i}>
                          <td>{item.adTitle}</td>
                          <td>{UnixTimestampConvert(item.startDate)}</td>
                          <td>{UnixTimestampConvert(item.endDate)}</td>
                          <td>{item.impression}</td>
                          <td>{item.totalBudget}</td>
                          <td>{item.cpc}</td>
                          <td>{item.totalSpent}</td>
                          <td><button className='d-flex btn btn-link' onClick={() => handleDelete(item.id)}>
                            <i className='fas fa-trash-alt text-danger mt-1' /></button></td>
                        </tr>
                      }) : <tr>
                        <td colSpan={8}>No ads Found</td>
                      </tr>}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateAdModal />
    </>
  )
}
const mapStateToProps = state => {
  return {
    adsData: state.adManagerReducer.data,
    loading: state.adManagerReducer.loading
  }
}

export default connect(mapStateToProps)(Admanager);