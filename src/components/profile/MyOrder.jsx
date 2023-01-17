import React, { useState, useEffect } from "react";
import ProfileSideBar from "../profile/ProfileSideBar";
import { Link } from "react-router-dom";
import { getBoughtItemsApi } from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import { usdSymbol, explorerNetworkURL } from '../../constant/constant'

const $ = window.jQuery;

function MyOrder() {
  $(window).scrollTop('0');
  const [state, setState] = useState({
    data: [],
    totalRecords: 0,
    loading: true,
    currentPage: 0,
    searchVal: '',
    isApiHit: false
  });

  useEffect(() => {
    _fetchApiCall()
  }, [state.isApiHit]);

  async function _fetchApiCall() {
    if (!state.isApiHit) {
      let query = `&offset=${state.currentPage}`
      let res = await getBoughtItemsApi(query);
      try {
        if (res && res.data && res.data.status === 1) {
          setState({
            data: res.data.data,
            loading: false,
            totalRecords: res.data.total_records,
            isApiHit: true
          });
        } else if (res && res.data && res.data.status === 0) {
          setState({
            data: [],
            totalRecords: 0,
            loading: false,
            currentPage: 0,
            searchVal: '',
            isApiHit: false
          })
        }
      } catch (err) {
        ErrorHandler(err)
      }
    }
  }

  const handleChangeCount = async (value) => {
    setState({
      ...state,
      currentPage: value - 1,
      isApiHit: false
    })
  }

  if (state.loading) {
    return <Loader />
  } return (
    <>
      <div className="dashboard-wrapper main-padding current-item">
        <div className="row">
          <ProfileSideBar />
          <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
              <div className="content-box">
                <h2 className="mb-4">My Orders</h2>
                <div className="table">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>OrderId</th>
                        <th>Item info</th>
                        <th>Price</th>
                        <th>Buyer</th>
                        <th>Seller</th>
                        <th>Hash</th>
                        <th>Sold On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.data && state.data.length > 0 ? state.data.map((item, index) => {

                        return <tr key={index}>
                          <td>{item.orderId}</td>
                          <td><Link to={{ pathname: `/product-detail/${item.productslug}/${item.productId}` }}>{item.productTitle}</Link></td>
                          <td>{usdSymbol} {item.total}</td>
                          <td><Link to={`/user/${item.buyer}`}>{item.buyer}</Link></td>
                          <td><Link to={`/user/${item.seller}`}>{item.seller}</Link></td>
                          <td>{item.transactionHash ?
                            <a target="_blank" href={`${explorerNetworkURL}tx/${item.transactionHash}`}>{item.transactionHash.substring(0, 15)}...</a> : '...'}</td>
                          <td>{item.createdAt}</td>
                          <td><span className='d-inline' ><Link to={`/review/${item.productId}/${item.orderId}`} className="btn btn-primary" style={{ marginBottom: '5px' }}>Seller Reviews</Link></span>
                            {item.privateFiles && item.privateFiles.length > 0 ? item.privateFiles.map((itm, i) => {
                              return <span className='d-inline'><a className="btn btn-primary" target='_blank' download href={itm.ipfsImageHash} style={{ marginBottom: '5px' }}>Download Private File</a></span>
                            }) : ''}</td>
                        </tr>
                      }) : ""}
                    </tbody>
                  </table>
                </div>
                {/*Pagination commented  */}
                <div className="collection-pagenation">
                  {state.data.length > 10 ? <Pagination
                    current={state.currentPage}
                    defaultCurrent={state.currentPage}
                    total={state.totalRecords}
                    onChange={handleChangeCount}
                  /> : ''}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MyOrder;