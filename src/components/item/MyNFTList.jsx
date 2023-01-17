import React, { useState, useEffect } from "react";
import TransferModal from "../modals/TransferModal";
import ProfileSideBar from "../profile/ProfileSideBar";
import { Redirect, withRouter } from "react-router-dom";
import {
  UserNFTItemsListApi,
  SearchUserNFTItemsListApi,
  PaginatedUserNFTItemsListApi,
  EditItemsApi
} from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import { connect } from 'react-redux'
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import VideoImageThumbnail from 'react-video-thumbnail-image';
const $ = window.jQuery

function MyNFTList(props) {

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

  useEffect(async () => {
    let res = await UserNFTItemsListApi();
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
    CalculatePrice()
  }, [reset]);

  const handleCreateItemModal = () => {
    setOpen((x) => !x);
    setShow(false);
  };

  const handleDisplayPortion = () => {
    setShow(true);
  };

  const handleChange = (e) => {
    setSearchVal(e.target.value)
  }

  const handleSearchRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    let res = await SearchUserNFTItemsListApi(searchVal);
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
    let res = await PaginatedUserNFTItemsListApi(value - 1);
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

  if (redirect) {
    return <Redirect to={{
      pathname: `/edit-item/${id}`,
      state: { data: editItemData, loading, id, relisted: true }
    }} />
  } else if (loading) {
    return <Loader />
  } return (
    <>
      <div className="dashboard-wrapper main-padding nft-list">
        <div className="row">
          <ProfileSideBar />
          <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
              <div className="content-box">
                <h2 className="mb-4">My NFT Items</h2>
                {itemsData.length < 1 ? <div className='content'>
                  <h5>You have no <b>{searchVal}</b> NFT right now</h5>
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
                          <h6 className="title">{item.title}</h6>
                          <p>{item.sub_title.substring(0, 50)} </p>
                        </div>
                        <div className="actions buy-sell">
                          <a className="btn-default hvr-bounce-in" data-toggle="modal" data-target={`.transferModel-${item.id}`}><span className="icon fa fa-tick">
                          </span>Transfer NFT</a>

                          <a className='btn-default hvr-bounce-in' onClick={() => handleEditListing(item)}>Sell</a>
                        </div>
                      </div>
                      <TransferModal {...item} />
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
    </>
  )
}
const mapStateToProps = state => {
  return {
    ethPriceState: state.userReducer.ethPriceState,
  }
}

export default connect(mapStateToProps)(withRouter(MyNFTList));