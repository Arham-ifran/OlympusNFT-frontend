import React, { useState, useEffect } from "react";
import TransferModal from "../modals/TransferModal";
import CreateItemModal from "../modals/CreateItemModal";
import ProfileSideBar from "../profile/ProfileSideBar";
import { Redirect, withRouter, Link } from "react-router-dom";
import { UserItemsListApi, EditItemsApi, SearchUserItemsListApi, PaginatedUserItemsListApi, productDeleteApi } from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import { usdSymbol, ethSymbol } from '../../constant/constant'
import { connect } from 'react-redux'
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import Swal from 'sweetalert2'
import VideoImageThumbnail from 'react-video-thumbnail-image';
const $ = window.jQuery

function CurrentItemList(props) {
  $(window).scrollTop('0');
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [editItemData, setEditItemData] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [totalRecords, setTotalrecords] = useState('')
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [searchVal, setSearchVal] = useState('')
  const [reset, setReset] = useState(false)
  const [ethereum, setEthereum] = useState('')

  const CalculatePrice = async () => {
    let value = await EthPriceCalculation()
    setEthereum(value)
  }

  useEffect(() => {
    _fetchUserList()
    CalculatePrice()
  }, [reset]);

  async function _fetchUserList() {
    let res = await UserItemsListApi();
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

  const handleCreateItemModal = () => {
    setOpen((x) => !x);
    setShow(false);
  };

  const handleDisplayPortion = () => {
    setShow(true);
  };

  const handleEditListing = async (state) => {
    let res = await EditItemsApi(state.id);
    try {
      if (res && res.data && res.data.status === 1) {
        let data = [];
        data.push(res.data.data);
        setId(state.id);
        setEditItemData(data);
        setLoading(false);
        setRedirect((x) => !x);
      } else if (res && res.data && res.data.status === 0) {
        setRedirect(false);
        setEditItemData([]);
        setLoading(false);
      }
    } catch (err) {
      ErrorHandler(err)
    }
  };

  const handleChange = (e) => {
    setSearchVal(e.target.value)
  }

  const handleSearchRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    let res = await SearchUserItemsListApi(searchVal);
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
    setLoading(true)
    setReset(x => !x)
  }

  const handleChangeCount = async (value) => {
    setCurrentPage(value)
    setLoading(true)
    let res = await PaginatedUserItemsListApi(value - 1);
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
  const deleteRecord = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        removeRecord(id)

      }
    })
    async function removeRecord(id) {
      let body = {};
      if (id) {
        body['productId'] = id
      }
      let res = await productDeleteApi(body);
      try {
        if (res && res.status === 200) {
          let response = await UserItemsListApi();
          if (response && response.data && response.data.status === 1) {
            setItemsData(response.data.data);
            setLoading(false);
            setTotalrecords(response.data.total_records)
          } else if (response && response.data && response.data.status === 0) {
            setEditItemData([]);
            setLoading(false);
          }

          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else if (res && res.data && res.data.status === 0) {

        }
      } catch (err) {
        ErrorHandler(err)
      }
    }
  }
  if (redirect) {
    return <Redirect to={{
      pathname: `/edit-item/${id}`,
      state: { data: editItemData, loading, id }
    }} />
  } else if (loading) {
    return <Loader />
  } return (
    <>
      <div className="dashboard-wrapper main-padding current-item">
        <div className="row">
          <ProfileSideBar />
          <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
              <div className="content-box">
                <h2 className="mb-4">Current Items</h2>
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
                          name="search" className="form-control" placeholder="Search for an item" />
                      </div>
                    </div>
                  </form>
                </div> : ''}
                <div className="collection-items product-grid">
                  {itemsData && itemsData.length > 0 ? itemsData.map((item, index) => {
                    let mediaType = JSON.parse(item.productMedia);
                    return <div className="product-item" key={index}>
                      <div className="product-wrap">
                        <div className="image">
                          {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                            videoUrl={item.ipfsImageHash}

                            className="img-fluid"
                            alt={item.title}
                          />}
                        </div>
                        <div className="product-info">
                          <h6 className="title"><Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}>{item.title}</Link></h6>
                          <p>{item.sub_title.length > 40 ? item.sub_title.substring(0, 50) + '...' : item.sub_title} </p>
                          <div className="seller-info">
                            <div className="item">
                              <span className="title">Views:</span>
                              <a ><span className="value">{item.views}</span></a>
                            </div>
                            <div className="item">
                              <span className="title">Store:</span>
                              <a><span className="value">{item.store}</span></a>
                            </div>
                          </div>
                          <div className="price-wrapper">
                            {
                              !props.ethPriceState && item.priceType == "0" ?
                                <span className="price priceUsd">{usdSymbol}{item.priceUsd}</span>
                                :
                                !props.ethPriceState && item.priceType == "1" ?
                                  <span className="price bidprice">Bid Price: {usdSymbol}{item.bidPriceUsd}</span>
                                  :
                                  !props.ethPriceState && item.priceType == "2" ?
                                    <>
                                      <span className="price priceUsd">{usdSymbol}{item.priceUsd}</span>
                                      <span className="price bidprice">Bid Price: {usdSymbol}{item.bidPriceUsd}</span>
                                    </>

                                    : props.ethPriceState && item.priceType == "0" ?
                                      <span className="price priceUsd">{ethSymbol}{(item.priceUsd / ethereum).toFixed(4)}</span>

                                      : props.ethPriceState && item.priceType == "1" ?
                                        <span className="price bidprice">Bid Price: {ethSymbol}{(item.bidPriceUsd / ethereum).toFixed(4)}</span>

                                        : props.ethPriceState && item.priceType == "2" ?
                                          <>
                                            <span className="price priceUsd">{ethSymbol}{(item.priceUsd / ethereum).toFixed(4)}</span>
                                            <span className="price bidprice">Bid Price: {ethSymbol}{(item.bidPriceUsd / ethereum).toFixed(4)}</span>
                                          </> : ''
                            }
                          </div>
                        </div>
                        <div className="actions buy-sell">
                          <button className="btn-default hvr-bounce-in" onClick={() => handleEditListing(item)}><span className="icon fa fa-edit">
                          </span>Edit Listing</button>
                          <a className="btn-default hvr-bounce-in" onClick={() => deleteRecord(item.id)}><span className="icon fa fa-times">
                          </span>Cancel Listing</a>
                        </div>
                      </div>
                    </div>
                  }) : ""}
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
      <CreateItemModal Open={open} Display={show} handleModal={handleCreateItemModal} handleDisplay={handleDisplayPortion} />
      <TransferModal />
    </>
  )
}
const mapStateToProps = state => {
  return {
    ethPriceState: state.userReducer.ethPriceState,
  }
}

export default connect(mapStateToProps)(withRouter(CurrentItemList));