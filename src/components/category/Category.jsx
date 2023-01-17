import React, { useState, useEffect } from 'react';
import Logo from './../../assets/img/olympusnft-logo.gif';
import { getAllProductscApi, BoostedProductsApi } from './../../container/Api/api';
import { Link, useHistory } from 'react-router-dom';
import Loader from './../loader/Loader';
import Swal from 'sweetalert2';
import { Pagination } from 'antd';
import { usdSymbol, ethSymbol } from '../../constant/constant'
import { connect } from 'react-redux';
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import { ethereumPriceToggler } from './../../store/actions/userAction'
import Countdown from 'react-countdown';
import VideoImageThumbnail from 'react-video-thumbnail-image';
import { ErrorHandler } from '../../utils/message';

const Completionist = () => <span>Completed!</span>;

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return <span style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '5px', letterSpacing: '1px' }}>
      {days}:{hours}:{minutes}:{seconds}
    </span>
  }
}

const Category = (props) => {

  const [state, setState] = useState({
    isApiHit: false,
    query: '',
    data: [],
    min: '',
    max: '',
    totalRecord: 0,
    currentTab: props.location.pathname
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState(false)
  const [grid, setGrid] = useState(true)
  const [ethereum, setEthereum] = useState('')
  const [boostedProducts, setBoostedProducts] = useState('')
  const [stringQuery, setStringQuery] = useState(0)
  const [selectedRadioValue, setSelectedRadioValue] = useState('')
  const [checkedValues, setCheckedValues] = useState([])
  const [sortOption, setSortOption] = useState([
    { value: 'newest', name: 'Newest' },
    { value: 'oldest', name: 'Oldest' },
    { value: 'lower', name: 'Price - Low to high' },
    { value: 'higher', name: 'Price - High to low' },
    { value: 'only_auction', name: 'Only Auction' },
    { value: 'resellable', name: 'Resellable' },
    { value: 'transfer_copyright', name: 'Copyright transferred' }
  ])

  const history = useHistory();

  const CalculatePrice = async () => {
    let value = await EthPriceCalculation()
    setEthereum(value)
  }

  let pathName = props.location.pathname;
  let routeName = pathName.split('/');
  let currentTab = routeName[2];

  const listView = () => {
    setList(true)
    setGrid(false)
  }

  const gridView = () => {
    setList(false)
    setGrid(true)
  }

  async function fetchMyAPI(isUrlChange) {
    let query = '';
    if (isUrlChange) {
      query = currentTab
    } else {
      query = state.query ? state.query : currentTab
    }
    query += `&offset=${isUrlChange ? 0 : currentPage - 1}`
    let res = await getAllProductscApi(query)
    if (res && res.status === 200) {
      let data = res.data.data;
      setState({
        ...state,
        data: data,
        totalRecord: res.data && res.data.total_records ? res.data.total_records : 0,
        isApiHit: true,
        query: query,
        currentTab
      })
      setBoostedProducts(res.data.boosted_products)
      setLoading(false)
    } else if (res && res.data.status === 0) {
      setState({
        ...state,
        data: [],
        totalRecord: 0,
        isApiHit: true,
        query: '',
        currentTab: ''
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    let pathName = props.location.pathname;
    let routeName = pathName.split('/');
    let currentTab = routeName[2];
    CalculatePrice()
    if (!state.isApiHit || currentTab !== state.currentTab) {
      setLoading(true)
      let isUrlChange = currentTab !== state.currentTab ? true : false
      fetchMyAPI(isUrlChange)
    }
  }, [state.isApiHit, props.location])

  const applyFilter = (event, type, string = stringQuery) => {
    event.preventDefault()
    let query = '';
    if (type === 'currencyRange') {
      if (!state.min) {
        Swal.fire('Oops...', 'Pleas enter the min value!', 'error')
      } else if (!state.max) {
        Swal.fire('Oops...', 'Pleas enter the max value!', 'error')
      } else {
        query = `${state.currentTab}&min=${state.min}&max=${state.max}`;
      }
    } else {
      if (string === 0) {
        query = `${state.currentTab}&${type}=1`;
      } else {
        query = `${state.currentTab}&${string}`;
      }
    }
    setState({
      ...state,
      query,
      isApiHit: false
    })
  }

  const handleUpdateCurrency = (state) => {
    props.dispatch(ethereumPriceToggler(!state))
  }

  const changeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeCount = (value) => {
    setCurrentPage(value)
    setLoading(true)
    setState({
      ...state,
      isApiHit: false
    })
  }

  let boostedProductsApiCall = async (ad, slug, id) => {
    let res = await BoostedProductsApi(ad)
    setLoading(true)
    try {
      if (res) {
        setLoading(false)
        history.push(`/product-detail/${slug}/${id}`)
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  let handleChange = (e) => {
    let target = e.target;
    let value = target.type === 'checkbox' && target.checked ? target.value : '';
    let newArr = [...checkedValues];
    if (target.checked) {
      if (!newArr.includes(value + '=1')) {
        newArr.push(value + '=1');
        setCheckedValues(newArr)
      }
    } else {
      let filterOne = newArr.indexOf(e.target.value + '=1');
      newArr.splice(filterOne, 1)
      setCheckedValues(newArr)
    }
  }

  let handleSort = (e) => {
    let target = e.target;
    let value = target.type === 'radio' && target.checked ? target.value : '';
    if (target.checked) {
      setSelectedRadioValue('order_by=' + value)
    }
  }

  useEffect(() => {
    let str = checkedValues && checkedValues.toString()
    str += `&${selectedRadioValue}`
    if (str) {
      let min = state.min > 0 ? `&min=${state.min}` : '';
      let max = state.max > 0 ? `&max=${state.max}` : '';
      let stringif = str.includes(',') ? str.replaceAll(',', '&') : str + min + max;
      setStringQuery(stringif)
    }
  }, [checkedValues, state.min, state.max, selectedRadioValue])


  let curentCategory = state.currentTab === 'music' ? "Music" : state.currentTab === 'art' ? "Art" : state.currentTab === "film" ? "Film" : '';
  if (loading) {
    return <Loader />
  } return (
    <>
      <div className="main-wrapper category">
        <div className="page-title-section">
          <h1>{curentCategory}</h1>
          <p>{ }</p>
        </div>

        <div className="main-padding">
          <div className="mt-5 breadcrumb">
            <div className="breadcrumb-item"><Link to='/'>Home</Link></div>
            <div className="breadcrumb-item active" aria-current="page">{curentCategory}</div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div className="collection-sidebar">
                <h3>Filters</h3>
                <div className="filters">
                  <div className="item">
                    <h6 className="title">
                      <a data-toggle="collapse" data-target="#collapse_aside1" data-abc="true" aria-expanded="false">
                        Categories
                        <span className="icon fas plus-minus" />
                      </a>
                    </h6>
                    <div className="filter-content show" id="collapse_aside1">
                      <ul className="list-menu">
                        <li><Link className={state.currentTab === 'music' ? "active" : ''} to='/category/music' data-abc="true">Music </Link></li>
                        <li><Link className={state.currentTab === 'art' ? "active" : ''} to='/category/art' data-abc="true">Art </Link></li>
                        <li><Link className={state.currentTab === 'film' ? "active" : ''} to='/category/film' data-abc="true">Film </Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="item">
                    <h6 className="title">
                      <a data-toggle="collapse" data-target="#collapse_aside2" data-abc="true" aria-expanded="false" >
                        Other options
                        <span className="icon fas plus-minus" />
                      </a>
                    </h6>
                    <div className="filter-content collapse show" id="collapse_aside2">
                      <ul className="list-menu">
                        <li className="form-check">
                          <label htmlFor={sortOption[5].value} onChange={handleChange} className="form-check-label" style={{ fontWeight: 'bold' }}>
                            <input type="checkbox" defaultChecked={checkedValues && checkedValues.includes('resellable=1') ? true : false} id={sortOption[5].value} className="form-check-input" value={sortOption[5].value} />
                            {sortOption[5].name}</label>
                        </li>

                        <li className="form-check">
                          <label htmlFor={sortOption[6].value} onChange={handleChange} className="form-check-label" style={{ fontWeight: 'bold' }}>
                            <input type="checkbox" defaultChecked={checkedValues && checkedValues.includes('transfer_copyright=1') ? true : false} id={sortOption[6].value} className="form-check-input" value={sortOption[6].value} />
                            {sortOption[6].name}</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <form>
                    <div className="item">
                      <h6 className="title">
                        <a data-toggle="collapse" data-target="#collapse_aside3" data-abc="true" aria-expanded="false" >
                          Sort by
                          <span className="icon fas plus-minus" />
                        </a>
                      </h6>
                      <div className="filter-content collapse show" id="collapse_aside3">
                        <ul className="list-menu">
                          <li className="form-check">
                            <label className="form-check-label" style={{ fontWeight: 'bold' }}>
                              <input type="radio" defaultChecked={selectedRadioValue && selectedRadioValue === 'order_by=newest' ? true : false} name='radio1' onChange={handleSort} className="form-check-input" value={sortOption[0].value} />
                              {sortOption[0].name}</label>
                          </li>
                          <li className="form-check">
                            <label className="form-check-label" style={{ fontWeight: 'bold' }}>
                              <input type="radio" defaultChecked={selectedRadioValue && selectedRadioValue === 'order_by=oldest' ? true : false} name='radio1' onChange={handleSort} className="form-check-input" value={sortOption[1].value} />
                              {sortOption[1].name}</label>
                          </li>
                          <li className="form-check">
                            <label className="form-check-label" style={{ fontWeight: 'bold' }}>
                              <input type="radio" defaultChecked={selectedRadioValue && selectedRadioValue === 'order_by=lower' ? true : false} name='radio1' onChange={handleSort} className="form-check-input" value={sortOption[2].value} />
                              {sortOption[2].name}</label>
                          </li>
                          <li className="form-check">
                            <label className="form-check-label" style={{ fontWeight: 'bold' }}>
                              <input type="radio" defaultChecked={selectedRadioValue && selectedRadioValue === 'order_by=higher' ? true : false} name='radio1' onChange={handleSort} className="form-check-input" value={sortOption[3].value} />
                              {sortOption[3].name}</label>
                          </li>
                          <li className="form-check">
                            <label className="form-check-label" style={{ fontWeight: 'bold' }}>
                              <input type="checkbox" defaultChecked={checkedValues && checkedValues.includes('only_auction=1') ? true : false} onChange={handleChange} className="form-check-input" value={sortOption[4].value} />
                              {sortOption[4].name}</label>
                          </li>

                        </ul>
                      </div>
                    </div>
                    <div className="item">
                      <h6 className="title">
                        <a data-toggle="collapse" data-target="#collapse_aside4" data-abc="true" aria-expanded="false" >
                          Price
                          <span className="icon fas plus-minus" />
                        </a>
                      </h6>
                      <div className="filter-content collapse show" id="collapse_aside4">
                        {/* <input type="range" className="custom-range" min={0} max={100} name /> */}
                        <div className="form-row">
                          <div className="form-group col-md-6"> <label>Min</label> <input className="form-control" name="min" value={state.min} onChange={(e) => changeHandler(e)} placeholder="$0" type="number" step="0.01" /> </div>
                          <div className="form-group col-md-6"> <label>Max</label> <input className="form-control" name="max" value={state.max} onChange={(e) => changeHandler(e)} placeholder="$1,0000" step="0.01" type="number" /> </div>
                        </div>
                        <a className="btn-default hvr-bounce-in"
                          // data-abc="true" 
                          onClick={(event) => applyFilter(event, 'query', stringQuery)}>
                          Apply Now</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="form-check form-switch">
                <b>{usdSymbol}</b>
                <label className="switch">
                  <input type="checkbox" value={props.ethPriceState} onChange={() => handleUpdateCurrency(props.ethPriceState)} />
                  <span className="slider round"></span>
                </label>
                <b>{ethSymbol}</b>
              </div>
              <div className="collection-main">
                <div className="collection-filters">
                  <div className="items-show">
                    <span>Showing {state.data.length}/{state.totalRecord}</span>
                  </div>
                  <div className="items-view">

                    <button className={list ? "list active" : 'list'} onClick={listView}><i className="fa fa-bars" /></button>
                    <button className={grid ? "grid active" : 'grid'} onClick={gridView}><i className="fa fa-th-large" /></button>
                  </div>
                </div>
                <div className={list ? "collection-items product-list" : "collection-items product-grid"} >
                  {/* Boosted Products */}
                  {boostedProducts && Object.keys(boostedProducts).length > 0 ?
                    <>
                      {boostedProducts.map((item, index) => {
                        return <div className="product-item" key={index}>
                          <div className="product-wrap">
                            <div className="image">
                              <a onClick={() => boostedProductsApiCall(item.adId, item.slug, item.id)} >
                                <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /></a>
                            </div>
                            <div className="product-info">
                              <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}><h6 className="title">{item.title} </h6></Link>
                              <p>{item.sub_title} </p>
                              <div className="seller-info">
                                <div className="item">
                                  <span className="title">Seller: </span>
                                  <Link to={`/user/${item.seller}`} className="value">{item.seller}</Link>
                                </div>
                                {item.priceType !== 0 ? <div className="item">
                                  <span className="title">Auction Time:</span>
                                  <span className="value" id="timer">
                                    {item.auctionTime !== "Expired" ?
                                      <Countdown
                                        date={new Date(Number(item.auctionTime) * 1000).getTime()}
                                        renderer={renderer}
                                      />
                                      : "Expired"}
                                  </span>
                                </div> : ""}

                              </div>
                            </div>
                            <div className="actions">
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
                              <div className="boosted">
                                <button className='btn btn-link' onClick={() => boostedProductsApiCall(item.adId, item.slug, item.id)}>Boosted</button>
                              </div>

                            </div>
                          </div>
                        </div>
                      })}
                    </> : ''}

                  {state.data && Object.keys(state.data).length > 0 ?
                    state.data.map((item, index) => {
                      let mediaType = JSON.parse(item.productMedia);
                      return <div className="product-item" key={index} >
                        <div className="product-wrap">
                          <div className="image">
                            <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}>
                              {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                                videoUrl={item.ipfsImageHash}

                                className="img-fluid"
                                alt={item.title}
                              />
                              }</Link>
                          </div>
                          <div className="product-info">
                            <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}><h6 className="title">{item.title} </h6></Link>
                            <p>{item.sub_title} </p>
                            <div className="seller-info">
                              <div className="item">
                                <span className="title">Seller: </span>
                                <Link to={`/user/${item.seller}`} className="value">{item.seller}</Link>
                              </div>
                              {item.priceType !== 0 ? <div className="item">
                                <span className="title">Auction Time:</span>
                                <span className="value" id="timer">
                                  {item.auctionTime !== "Expired" ?
                                    <Countdown
                                      date={new Date(Number(item.auctionTime) * 1000).getTime()}
                                      renderer={renderer}
                                      zeroPadTime={2}
                                    />
                                    : "Expired"}
                                </span>
                              </div> : ""}

                            </div>
                          </div>
                          <div className="actions">
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
                            <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }} className="btn-default hvr-bounce-in">View Details</Link>
                          </div>
                        </div>
                      </div>
                    }) : <div className='m-auto'>
                      <div className="no-content-class">
                        <h4>No Item Available</h4>
                      </div>
                    </div>
                  }
                </div>
                {state.totalRecord > 10 ? <Pagination
                  current={state.currentPage}
                  defaultCurrent={state.currentPage}
                  total={state.totalRecord}
                  onChange={handleChangeCount}
                /> : ''}
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

export default connect(mapStateToProps)(Category);