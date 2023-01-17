import { useState, useEffect } from "react"
import Logo from './../../assets/img/olympusnft-logo.gif';
import { UserItemsListApi, PaginatedUserItemsListApi, PublishAdApi, getSettings } from './../../container/Api/api'
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import { Message, ErrorHandler } from "../../utils/message"
import { Pagination } from 'antd';
import { connect } from 'react-redux'
import Loader from "../loader/Loader";
import SmallLoader from './../loader/SmallLoader'
import { fetchAdManagerData } from './../../store/actions/ad-managerAction'
import Web3 from 'web3'
import { etheriumProvider, supportedNetworkVersions, supportedNetworks, networkName, ethSymbol } from '../../constant/constant'
import { readContractByName } from "../../utils/contracts";
import VideoImageThumbnail from 'react-video-thumbnail-image';
const toHex = require('to-hex')
let transactionFee;

const $ = window.jQuery
function CreateAdModal(props) {
  const [loading, setLoading] = useState(true)
  const [itemsData, setItemsData] = useState([])
  const [totalRecords, setTotalrecords] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [ethereum, setEthereum] = useState('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [bidType, setBidType] = useState(0)
  const [cpc, setCPC] = useState('')
  const [compaignDays, setCompaignDats] = useState(0)
  const [selectProducts, setSelectProducts] = useState([])
  const [errorsStartDate, setStartDateErrors] = useState('')
  const [errorsEndDate, setEndDateErrors] = useState('')
  const [errorsBudget, setBudgetErrors] = useState('')
  const [errorsCPC, setCPCErrors] = useState('')
  const [errors, setErrors] = useState('')
  const [errorsTitle, setErrorsTitle] = useState('')
  const [loader, setLoader] = useState(false)
  const [adManagerFee, setAdManagerFee] = useState('')
  const [account, setAccount] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  let connected = localStorage.getItem('walletConn')


  const CalculatePrice = async () => {
    let value = await EthPriceCalculation()
    setEthereum(value)
  }
  useEffect(async () => {
    const web3 = new Web3(etheriumProvider)
    if (window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
    }
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0] ? accounts[0] : '')
    let res = await UserItemsListApi();
    let settings = await getSettings();
    setAdManagerFee(settings.data.data.ad_manager_fee)

    try {
      if (res && res.data && res.data.status === 1) {
        setItemsData(res.data.data);
        setLoading(false);
        setTotalrecords(res.data.total_records)
      } else if (res.data.status === 0) {
        setItemsData([]);
        setLoading(false);
        setTotalrecords(0)
      }
    } catch (err) {
      ErrorHandler(err)
    }
    CalculatePrice()
  }, []);

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
  const handleSelect = item => () => {
    setErrors('')
    const clickedProduct = selectProducts.indexOf(item);
    const all = [...selectProducts];
    if (clickedProduct === -1) {
      all.push(item);
    } else {
      all.splice(clickedProduct, 1);
    }

    setSelectProducts(all);
  }

  const handleSelectStartDate = e => {
    let date = Math.floor(Date.now() / 1000);
    let value = parseInt((new Date(e.target.value).getTime() / 1000).toFixed(0));
    if (value >= date) {
      setStartDate(value)
      setStartDateErrors('')
    } else if (value < date) {
      setStartDate('')
      setStartDateErrors('Please select date after to date')
    }
  }

  const handleEndDate = e => {
    let value = parseInt((new Date(e.target.value).getTime() / 1000).toFixed(0));
    if (value > startDate) {
      setEndDate(value)
      setEndDateErrors('')
      let compaign = parseInt((value - startDate) / 86400)
      setCompaignDats(compaign)
    } else if (startDate > value) {
      setEndDate('')
      setEndDateErrors('End date must be higher than start date')
    }
  }

  const handleChooseBudget = e => {
    setTotalBudget(e.target.value)
    setBudgetErrors('')
  }

  const handleBidType = e => {
    setBidType(e.target.value)
    if (Number(e.target.value) === 1) {
      setCPCErrors('Please provide cpc value')
    } else if (e.target.value === 0) {
      setCPCErrors('')
    }
  }

  const handleSetCpc = e => {
    setCPC(e.target.value)
    if (e.target.value) {
      setCPCErrors('')
    }
  }
  const handleChooseTitle = e => {
    setTitle(e.target.value)
    if (!e.target.value) {
      setErrorsTitle('Please provide title')
    } else if (e.target.value) {
      setErrorsTitle('')
    }
  }

  const readContract = async () => {
    const web3 = new Web3(etheriumProvider)
    const instance = readContractByName("OlympusNFTMintableToken", networkName);
    let utilValue = web3.utils.toWei(adManagerFee.toString(), "ether")
    let account = await web3.eth.getAccounts()
    let data = await web3.eth.sendTransaction(
      {
        from: account[0],
        to: instance.contractAddress,
        value: utilValue,
      }
    )
    const { gasPrice } = await web3.eth.getTransaction(data.transactionHash)
    const { gasUsed } = await web3.eth.getTransactionReceipt(data.transactionHash)
    transactionFee = (gasPrice * gasUsed) / 10E18
    return { data }
  }


  const handleSubmitForm = async (e) => {

    const instance = readContractByName("OlympusNFTMintableToken", networkName);
    e.preventDefault();
    if (!startDate) {
      setStartDateErrors("Please select Start Date")
    } else if (!endDate) {
      setEndDateErrors("Please select End Date")
    } else if (!totalBudget) {
      setBudgetErrors("Please provide budget")
    } else if (selectProducts.length < 1) {
      setErrors('Please select minimum one product')
    } else if (bidType === 1 && !cpc) {
      setCPCErrors('Please provide cpc')
    } else if (!title) {
      setErrorsTitle('Please provide title')
    }

    else if (!errors && !errorsStartDate && !errorsEndDate && !errorsBudget && !errorsCPC && !errorsTitle) {
      setLoader(true)
      if (!connected || supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1) {
        Message('error', 'Sorry', "Connect to supported network (" + supportedNetworks + ") first or connect wallet.")
        setLoader(false)
        return;
      }

      let data = await readContract();
      try {

        let from_address = data?.data.from;
        let transactionHash = data?.data.transactionHash
        let body = {
          user_id: localStorage.getItem('id'),
          title: title,
          start_date: startDate,
          end_date: endDate,
          from_address,
          transaction_hash: transactionHash,
          price_paid: transactionFee,
          total_budget: totalBudget,
          product_ids: selectProducts.toString(),
          bid_type: bidType,
          cpc: cpc,
          contract: instance.contractAddress
        }
        let res = await PublishAdApi(body);
        try {

          if (res.data.status === 1) {
            setTitle('')
            setStartDate('')
            setEndDate('')
            setTotalBudget('')
            setSelectProducts([])
            setCompaignDats('')
            setBidType('')
            setLoader(false)
            let message = res.data.message;
            props.dispatch(fetchAdManagerData())
            Message('success', 'Success', message)
            $('.create-ad').hide();
            $('body').removeClass('modal-open');
            $('body').css('padding-right', '0px');
            $('.modal-backdrop').remove();
          } else if (res.data.status === 0) {
            setLoader(false)
            let message = res.data.message;
            Message('error', 'Error', message)
          }
        }
        catch (err) {

          ErrorHandler(err)
        }
      }
      catch (err) {
        Message('error', 'Sorry', err.message)
        setLoader(false)
      }
    }
  }

  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd;
  return (
    <>
      <div className="modal fade create-ad" tabIndex={-1} role="dialog" id="myLargeModalLabel" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-title">
              <h4>Create an Ad</h4>
            </div>
            <div className="create-ad-wrapper">
              <div className="ad-items-list">
                <div className="collection-items product-grid">

                  {itemsData && itemsData.length > 0 ? itemsData.map((item, i) => {
                    let mediaType = JSON.parse(item.productMedia);
                    return <div className="product-item" key={i} >
                      <div className="product-wrap">
                        <div className="image">
                          {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                            videoUrl={item.ipfsImageHash}

                            className="img-fluid"
                            alt={item.title}
                          />}
                        </div>
                        <div className="product-info">
                          <h6 className="title">{item.title} </h6>
                          <span className="price">${item.priceUsd}</span>
                        </div>
                        <div className="custom-control custom-checkbox mb-3">
                          <input className="custom-control-input" id={item.id} type="checkbox" value={item.id} name={item.id} onChange={handleSelect(item.id)} />
                          <label className="custom-control-label" htmlFor={item.id}></label>
                        </div>
                      </div>
                    </div>
                  }) : loading ? <Loader /> : ''}
                  <div className='form-group'>
                    {errors && errors !== '' ? <span className='alert alert-danger'>{errors}</span> : ''}
                  </div>
                  <br />
                  <br />

                  {itemsData.length > 10 ? <Pagination
                    current={currentPage}
                    defaultCurrent={currentPage}
                    total={totalRecords}
                    onChange={handleChangeCount}
                  /> : ''}
                </div>
              </div>
              <div className="ad-form">
                <form>
                  <h5>Duration and Budget</h5>
                  <hr />
                  <div className="form-group">
                    <label>Title </label>
                    <input type="text" className="form-control" placeholder='Title'
                      value={title} onChange={handleChooseTitle} />
                    {errorsTitle && errorsTitle !== '' ? <small className='error-ad'>{errorsTitle}</small> : ''}
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Start Date</label>
                      <input type="date" className="form-control"
                        onChange={handleSelectStartDate} min={today} />
                      {errorsStartDate && errorsStartDate !== '' ? <small className='error-ad'>{errorsStartDate}</small> : ''}
                    </div>
                    {startDate ? <div className="form-group col-md-6">
                      <label>End Date</label>
                      <input type="date" className="form-control"
                        onChange={handleEndDate} min={today} />
                      {errorsEndDate && errorsEndDate !== '' ? <small className='error-ad'>{errorsEndDate}</small> : ''}
                    </div> : ""}
                  </div>
                  <div className="form-group">
                    <label>Total Budget </label>
                    <input type="number" className="form-control" placeholder='Total Budget'
                      value={totalBudget} onChange={handleChooseBudget} />
                    {errorsBudget && errorsBudget !== '' ? <small className='error-ad'>{errorsBudget}</small> : ''}
                  </div>
                  <div className="form-group ">
                    <label>Bidding type</label>
                    <select className="form-control" value={bidType} onChange={handleBidType}>
                      <option value={0}>Automatic (Suggested)</option>
                      <option value={1}>Set my own bid</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>CPC bid </label>
                    <input type="number" className="form-control" value={cpc} onChange={handleSetCpc} />
                    {errorsCPC && errorsCPC !== '' ? <small className='error-ad'>{errorsCPC}</small> : ''}
                  </div>
                  <div>
                    <span>Current Average CPC: </span> <span>{props.average_cpc}</span><br />
                    <span>Suggested CPC: </span> <span>${props.cpc}</span>
                  </div>
                  <div className="ad-detail">
                    <div className="item">
                      <span>Total Budget :</span><span><b>{totalBudget}</b></span>
                    </div>
                    <div className="item">
                      <span>Split between :</span><span><b>{selectProducts.length} listing</b></span>
                    </div>
                    <div className="item">
                      <span>Total Days to run :</span><span><b>{compaignDays}days</b></span>
                    </div>
                    <div className="item">
                      <span>Estimated CPC : </span><span><b>{props.cpc}</b></span>
                    </div>
                    <div className="item">
                      <span>Will start on :</span><span><b>Immediately</b></span>
                    </div>
                    <div className="item">
                      <span>Total :</span><span><b>{ethSymbol}{totalBudget}</b></span>
                    </div>
                  </div>
                  {errors && errors !== '' ? <span className='alert alert-danger'>{errors}</span> : ''}
                  {!loader ? <button className="btn-default hvr-bounce-in" onClick={handleSubmitForm}>
                    PROCEED TO PAY
                  </button> : <SmallLoader />}
                </form>
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
    cpc: state.siteSettingReducer.suggested_cpc_price,
    average_cpc: state.siteSettingReducer.current_average_cpc_price,
  }
}

export default connect(mapStateToProps)(CreateAdModal);