import React, { useEffect, useState } from 'react';
import { UserProfileStoreApi, SearchUserStoreApi, PaginatedUserStoreApi } from './../../container/Api/api';
import { Link, withRouter } from 'react-router-dom';
import Loader from '../loader/Loader';
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';

const $ = window.jQuery;
function Stores() {
  $(window).scrollTop('0');
  const [storeData, setStoreData] = useState([]);
  const [totalRecords, setTotalrecords] = useState('')
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [searchVal, setSearchVal] = useState('')
  const [reset, setReset] = useState(false)

  useEffect(() => {
    _fetchApiCall()
  }, [reset]);

  async function _fetchApiCall() {
    let res = await UserProfileStoreApi();
    try {
      if (res.data.status === 1) {
        let data = res.data.data;
        setStoreData(data);
        setLoading(false);
        setTotalrecords(res.data.total_records)
      } else if (res.data.status === 0) {
        setStoreData([]);
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
    let res = await SearchUserStoreApi(searchVal);
    try {
      if (res.data.status === 1) {
        let data = res.data.data;
        setStoreData(data);
        setLoading(false);
      } else if (res.data.status === 0) {
        setStoreData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  const handleReset = () => {
    setLoading(true)
    setSearchVal('')
    setReset(x => !x)
  }

  const handleChangeCount = async (value) => {
    setCurrentPage(value)
    setLoading(true)
    let res = await PaginatedUserStoreApi(value - 1);
    try {
      if (res.data.status === 1) {
        let data = res.data.data;
        setStoreData(data);
        setLoading(false);
        setTotalrecords(res.data.total_records)
      } else if (res.data.status === 0) {
        setStoreData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  if (loading) {
    return <Loader />
  } else return (
    <>
      <div className='content-box'>
        <h3>Stores</h3>
        {storeData.length < 1 ? <div className='content'>
          <h5>You have no <b>{searchVal}</b> stores</h5>
          <p>You need to create a store to start selling</p>
          <button className="btn-default upgrade hvr-bounce-in" onClick={handleReset}>
            Back
          </button>
        </div> : ''}
        <div className='content'>
          <Link to='/create-store' className='btn-default hvr-bounce-in'>
            <span className='icon fa fa-plus' />Create a store
          </Link>
        </div>
        {storeData.length > 0 ? <div className='search-bar'>
          <form>
            <div className='search'>
              <div className='form-group'>
                <span className='icon fa fa-search' onClick={handleSearchRequest} />
                <input type='text' name='search_store' className='form-control'
                  value={searchVal} onChange={handleChange} placeholder='Search Store by Name' />
              </div>
            </div>
          </form>
        </div> : ''}
        {storeData.length > 0 ? <div className='collection-items product-grid'>
          {storeData && storeData.length > 0 ? storeData.map((item, index) => {
            return <div className='product-item' key={index}>
              {/* <a> */}
              <div className='product-wrap'>
                <div className='image'>
                  <img src={item.image} alt={item.store_title} className='img-fluid' />
                </div>
                <div className='product-info'>
                  <Link to={{ pathname: `/store-detail/${item.id}` }} >
                    <h6 className='title'>{item.store_title}</h6>
                  </Link>
                  <p>{item.sub_title}</p>
                  <div className='seller-info'>
                    <div className='item'>
                      <span className='title'>Category: </span>
                      <span className='value'>{item.category}</span>
                    </div>
                    <div className='item'>
                      <span className='title'>Items: </span>
                      <span className='value'><b>{item.total_item} items</b></span>
                    </div>
                    {/*<div className='item'>
                        <span className='title'>Seller's rating:</span>
                        <span className='reviews'>
                          <span className='stars'>
                            <span className='fas fa-star' />
                            <span className='fas fa-star' />
                            <span className='fas fa-star' />
                            <span className='fas fa-star' />
                            <span className='fas fa-star' />
                          </span>
                          <span className='rating'><span>(5.0)</span></span>
                        </span>
                    </div>*/}
                  </div>
                </div>
              </div>
              {/* </a> */}
            </div>
          }) : ''}

        </div>
          : ''}
        {totalRecords > 10 ? <Pagination
          current={currentPage}
          defaultCurrent={currentPage}
          total={totalRecords}
          onChange={handleChangeCount}
        /> : ''}
        {/* <div className='collection-pagenation'>
          <ul className='pagination justify-content-center'>
            <li className='page-item disabled'><a className='page-link'><span className='fas fa-chevron-left' /></a></li>
            <li className='page-item active'><a className='page-link'>1</a></li>
            <li className='page-item'><a className='page-link'>2</a></li>
            <li className='page-item'><a className='page-link'>3</a></li>
            <li className='page-item'><a className='page-link'><span className='fas fa-chevron-right' /></a></li>
          </ul>
        </div> */}
      </div>
    </>
  )
}
export default withRouter(Stores);
