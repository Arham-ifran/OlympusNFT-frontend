import React, { useEffect, useState } from 'react';
import ProfileSideBar from '../profile/ProfileSideBar'
import MonthlyEarningChart from './MonthlyEarningChart'
import WeeklyEarningChart from './WeeklyEarningChart'
import { EarningApi, UserSoldItemsListApi, SearchUserSoldItemsListApi, PaginatedUserSoldItemsListApi } from './../../container/Api/api'
import { ErrorHandler, Message } from '../../utils/message'
import Loader from '../loader/Loader'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd';
import Logo from './../../assets/img/olympusnft-logo.gif'
import { usdSymbol, ethSymbol } from '../../constant/constant'

const $ = window.jQuery;
export default function MyEarnings() {
  $(window).scrollTop('0');
  const [weeklySales, setWeeklySales] = useState([])
  const [monthlySales, setMonthlySales] = useState([])
  const [loading, setLoading] = useState(false)
  function ArrayConvert(arr) {
    let newArray = []
    arr.map((item) => {
      let obj = item;
      obj['sales'] = Number(item.sales);
      newArray.push(obj)
    })
    return newArray
  }

  useEffect(() => {
    _fetchData()
  }, [])

  async function _fetchData() {
    let res = await EarningApi()
    setLoading(true)
    try {
      if (res.data.status === 1) {
        setLoading(false)
        let weekData = ArrayConvert(res.data.data.weekly_sales);
        let monthSales = res.data.data.monthly_sales.sales;
        setWeeklySales(weekData)
        setMonthlySales(monthSales)
      } else if (res.data.status === 0) {
        setLoading(false)
        setWeeklySales([])
        setMonthlySales([])
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }


  const [editItemData, setEditItemData] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [totalRecords, setTotalrecords] = useState('')
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [searchVal, setSearchVal] = useState('')
  const [reset, setReset] = useState(false)

  useEffect(() => {
    _fetchSold()
  }, [reset]);

  async function _fetchSold() {
    let res = await UserSoldItemsListApi();
    try {
      if (res && res.data && res.data.status === 1) {
        setItemsData(res.data.data);
        setLoading(false);
        setTotalrecords(res.data.total_records)
      } else if (res && res.data && res.data.status === 0) {
        setEditItemData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  const handleChange = (e) => {
    setSearchVal(e.target.value)
  }

  const handleSearchRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    let res = await SearchUserSoldItemsListApi(searchVal);
    try {
      if (res && res.data && res.data.status === 1) {
        let data = res.data.data;
        setItemsData(data);
        setLoading(false);
      } else if (res && res.data && res.data.status === 0) {
        setItemsData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  const handleReset = () => {
    setSearchVal('')
    setReset(x => !x)
  }

  const handleChangeCount = async (value) => {
    setCurrentPage(value)
    setLoading(true)
    let res = await PaginatedUserSoldItemsListApi(value - 1);
    try {
      if (res && res.data && res.data.status === 1) {
        let data = res.data.data;
        setItemsData(data);
        setLoading(false);
        setTotalrecords(res.data.total_records)
      } else if (res && res.data && res.data.status === 0) {
        setItemsData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  if (loading) {
    return <Loader />
  } return (
    <div className='dashboard-wrapper main-padding'>
      <div className='row'>
        <ProfileSideBar />
        <div className='col-lg-9 col-md-8'>
          <div className='content-wrapper'>
            <div className="content-box">
              <h2 className="mb-4">Sales</h2>
              <div className='row'>
                <div className='col-md-8'>
                  <WeeklyEarningChart data={weeklySales} />
                </div>
                <div className='col-md-4'>
                  <MonthlyEarningChart data={monthlySales} />
                </div>
              </div>
            </div>
          </div>

          <div className="content-wrapper">
            <div className="content-box">
              <h2 className="mb-4">Sold Items</h2>
              {itemsData.length < 1 ? <div className='content'>
                <h5>You have no <b>{searchVal}</b> Product</h5>
                <p>You need to create a product to start selling</p>
                <button className="btn-default upgrade hvr-bounce-in" onClick={handleReset}>
                  Back
                </button>
              </div> : ''}
              {itemsData.length > 0 ? <div className="search-bar">
                <form>
                  <div className="search">
                    <div className="form-group">
                      <span className="icon fa fa-search" onClick={handleSearchRequest} />
                      <input type="text" value={searchVal} onChange={handleChange}
                        name="search" className="form-control" placeholder="Search for sold item" />
                    </div>
                  </div>
                </form>
              </div> : ''}

              <div className="table">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th>Item info</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Buyer</th>
                      <th>Token Id</th>
                      <th>Sold On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsData && itemsData.length > 0 ? itemsData.map((item, index) => {

                      return <tr key={index}>
                        <td><Link to={{ pathname: `/product-detail/${item.slug}/${item.orderId}` }}>{item.orderId}</Link></td>
                        <td>{item.productTitle}</td>
                        <td> {item.status}</td>
                        <td>{usdSymbol} {item.total}</td>
                        <td><Link to={`/user/${item.buyer}`}>{item.buyer}</Link></td>
                        <td>{item.tokenId}</td>
                        <td>{item.createdAt}</td>
                      </tr>
                    }) : <tr></tr>}
                  </tbody>
                </table>
              </div>
              {/*Pagination commented  */}
              <div className="collection-pagenation">
                {itemsData.length > 10 ? <Pagination
                  current={currentPage}
                  defaultCurrent={currentPage}
                  total={totalRecords}
                  onChange={handleChangeCount}
                /> : ''}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
