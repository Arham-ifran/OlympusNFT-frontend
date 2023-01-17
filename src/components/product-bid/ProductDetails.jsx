import React, { Component } from 'react';
import { connect } from 'react-redux'
import Loader from '../loader/Loader';
import Logo from './../../assets/img/olympusnft-logo.gif';
import Badges from './../../assets/img/badges.svg';
import FacebookLogo from './../../assets/img/facebook.png'
import InstagramLogo from './../../assets/img/instagram.png'
import TwitterLogo from './../../assets/img/twitter.png'
import YoutubeLogo from './../../assets/img/youtube.png'
import { fetchProductsDetailsData } from './../../store/actions/actionProductDetails'
import { EthereumPriceApi, PlaceBidApi, IncreaseProductViewCounter } from './../../container/Api/api'
import CartModal from '../modals/CartModal';
import ReportModal from '../modals/ReportModal';
import { withRouter, Link } from 'react-router-dom';
import { ErrorHandler, Message } from '../../utils/message';
import Countdown from 'react-countdown';
import { usdSymbol, ethSymbol, contractAddress, bidMaxVal, ipfsUrl, etheriumProvider, currentPrice } from '../../constant/constant'
import Slider from 'react-slick'
import SmallLoader from '../loader/SmallLoader';
import Web3 from 'web3';
import VideoImageThumbnail from 'react-video-thumbnail-image';
let userId = localStorage.getItem('id')
const $ = window.jQuery;
const Completionist = () => <span>Expired</span>;
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
      {days}:{hours}:{minutes}:{seconds}
    </span>
  }
}

class ProductDetails extends Component {
  state = {
    loading: true,
    smallLoader: false,
    itemData: {},
    related_product: [],
    ethereum: '',
    id: this.props.match.params.id,
    EnterBidPrice: '',
    errors: '',
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    metaData: undefined,
    itemSold: false,
    accountId: ''
  }

  async componentDidMount() {
    $(window).scrollTop('0');
    let productId = this.props.match.params.id
    let stateToken = Boolean(localStorage.getItem('token'))
    let propsToken = Boolean(this.props.token)
    if (stateToken || propsToken) {
      this.setState({ isAuthenticated: true })
    }
    this.props.dispatch(fetchProductsDetailsData(productId));
    const web3 = new Web3(etheriumProvider)
    if (stateToken && window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
    }
    const accounts = await web3.eth.getAccounts();
    this.setState({
      accountId: accounts[0] ? accounts[0] : ''
    })
    this.ethereumPriceGet()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateToken = Boolean(localStorage.getItem('token'))
    let propsToken = Boolean(nextProps.token)
    if (prevState.itemData !== nextProps.itemData) {
      return {
        loading: nextProps.loading,
        itemData: nextProps.itemData,
        related_product: nextProps.related_product
      }
    }
    if (stateToken || propsToken) {
      return {
        isAuthenticated: true
      }
    } else if (!stateToken) {
      return {
        isAuthenticated: false
      }
    }
    if (prevState.id !== nextProps.match.params.id) {
      return {
        loading: nextProps.loading,
        itemData: nextProps.itemData,
        related_product: nextProps.related_product
      }
    }
    return null
  }

  IncreaseCounterOnView = async (id) => {
    let response = await IncreaseProductViewCounter(id)
    return response
  }

  ethereumPriceGet = async () => {
    let res = await EthereumPriceApi()
    try {
      if (res.status === 200) {
        this.setState({ ethereum: res.data[currentPrice].usd })
      }
    } catch (err) {
      console.log(err)
    }
  }

  checkSoldItem = () => {
    this.setState({ itemSold: Number(this.state.itemData.isSold) }) //
  }

  async componentDidUpdate(prevProps, prevState) {
    let userId = localStorage.getItem('id')
    let productId = this.props.match.params.id;
    if (productId !== prevProps.match.params.id) {
      this.props.dispatch(fetchProductsDetailsData(productId));
      const web3 = new Web3(etheriumProvider)
      if (window.ethereum && window.ethereum !== 'undefined') {
        await window.ethereum.enable();
      }
      const accounts = await web3.eth.getAccounts();
      if (this.props.itemData && this.props.itemData.isViewed === 0) {
        this.IncreaseCounterOnView(prevProps.match.params.id)
      }
      this.setState({
        loading: true,
        related_product: [],
        itemData: {},
        metaData: undefined,
        accountId: accounts[0] ? accounts[0] : ''
      })
      this.ethereumPriceGet()
    }

    if (this.state.itemData && this.state.itemData.isViewed === 0) {
      this.IncreaseCounterOnView(prevProps.match.params.id)
    }
    if (this.state.itemData && this.state.itemData.tokenMetadata !== prevState.itemData.tokenMetadata) {
      this.fetchTokenMetaData(this.state.itemData.tokenMetadata)
    }
    if (prevState.itemData.tokenId !== this.state.itemData.tokenId) {
      this.checkSoldItem(this.state.itemData.tokenId)
    }
  }

  handleChangeBidPrice = (e) => {
    this.setState({ EnterBidPrice: e.target.value, errors: '' })
  }

  handleSubmitBid = (e) => {
    e.preventDefault()
    if (this.state.EnterBidPrice == '') {
      this.setState({ errors: 'Please enter bid price.' })
    } else if (parseFloat(this.state.EnterBidPrice) < parseFloat(Number(this.state.itemData.minimum_bid) + Number(this.state.itemData.minimum_bid * bidMaxVal))) {
      this.setState({ errors: 'Bid price must be higher than minimum bid.' })
    } else {
      let body = {
        product_id: this.state.id,
        bidder_id: localStorage.getItem('id'),
        price: this.state.EnterBidPrice
      }
      this.setState({ smallLoader: true })
      this.submitUserBid(body)
    }
  }

  submitUserBid = async (body) => {
    let res = await PlaceBidApi(body)
    try {
      if (res.data.status === 1) {
        Message('success', 'Success', res.data.message)
        this.setState({ EnterBidPrice: '', smallLoader: false })
        this.props.dispatch(fetchProductsDetailsData(this.state.id))
      } else if (res.data.status === 0) {
        this.setState({ smallLoader: false })
        Message('error', 'Error', res.data.message)
      }
    }
    catch (err) {
      ErrorHandler(err)
    }
  }

  fetchTokenMetaData = (tokenMetaData) => {
    fetch(`${ipfsUrl}/${tokenMetaData}`)
      .then(response => response.json())
      .then(metaData => this.setState(() => {
        return {
          metaData
        }
      }));
  }

  render() {
    const settings = {
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      arrows: false,
      dots: false,
      pauseOnHover: true,
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      }, {
        breakpoint: 767,
        settings: {
          slidesToShow: 2
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }]
    };
    const { loading, itemData, related_product, EnterBidPrice, ethereum, metaData, itemSold, accountId } = this.state;
    let ethPrice = itemData.priceUsd / ethereum;

    if (loading || !itemData) {
      return <Loader />
    } return (
      <>
        <div className='main-wrapper main-padding product'>
          <div className='breadcrumb'>
            <div className='breadcrumb-item'><Link to='/'>Home</Link></div>
            <div className='breadcrumb-item'><a>{itemData.category ? itemData.category : 'Music'}</a></div>
            <div className='breadcrumb-item active' aria-current='page'>{itemData.title}</div>
          </div>
          <div className='row'>
            {itemData.mediaFiles && Object.keys(itemData.mediaFiles).length === 1 ? <div className='col-md-6'>
              <div className='product-image single'>
                {itemData.mediaFiles ? itemData.mediaFiles.map((item, i) => {
                  let mediaType = JSON.parse(item.productMedia);
                  return mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" key={i} /> : <VideoImageThumbnail snapshotAtTime={0}
                    videoUrl={item.ipfsImageHash}
                    className="img-fluid"
                    alt={item.title}
                    key={i}
                  />

                }) : ''}
              </div>
            </div> : itemData.mediaFiles && Object.keys(itemData.mediaFiles).length > 1 ? <div className='col-md-6'>
              <div className='product-image'>
                <div id='custCarousel' className='carousel slide' data-ride='carousel'>

                  <div className='carousel-inner'>
                    <div className='carousel-item active'>
                      <img src={Object.keys(itemData.mediaFiles).length > 0 ? itemData.mediaFiles[0].ipfsImageHash : ''} alt={itemData.title} className='img-fluid' />
                    </div>
                    <div className='carousel-item'>
                      {itemData.mediaFiles && Object.keys(itemData.mediaFiles).length > 1 ? itemData.mediaFiles.map((item, i) => {
                        if (i !== 0) {
                          let mediaType = JSON.parse(item.productMedia);
                          return mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" key={i} /> : <VideoImageThumbnail snapshotAtTime={0}
                            videoUrl={item.ipfsImageHash}
                            className="img-fluid"
                            alt={item.title}
                            key={i}
                          />
                        }
                      }) : ''}
                    </div>
                  </div>
                  <a className='carousel-control-prev' href='#custCarousel' data-slide='prev'>
                    <span className='carousel-control-prev-icon' /> </a> <a className='carousel-control-next' href='#custCarousel' data-slide='next'> <span className='carousel-control-next-icon' />
                  </a>
                  <ol className='carousel-indicators list-inline'>
                    <li className='list-inline-item active'>
                      <a id='carousel-selector-0' className='selected' data-slide-to={0} data-target='#custCarousel'>
                        <img src={Object.keys(itemData.mediaFiles).length > 0 ? itemData.mediaFiles[0].ipfsImageHash : ''} className='img-fluid' />
                      </a>
                    </li>

                    {itemData && Object.keys(itemData).length > 1 ? itemData.mediaFiles.map((item, i) => {
                      if (i !== 0) {
                        let mediaType = JSON.parse(item.productMedia);
                        let selector = `carousel-selector-${i}`
                        return <li className='list-inline-item' key={i}>
                          <a id={selector} className='selected' data-slide-to={i} data-target='#custCarousel'>
                            {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                              videoUrl={item.ipfsImageHash}

                              className="img-fluid"
                              alt={item.title}
                            />}
                          </a>
                        </li>
                      }
                    }) : ''}
                  </ol>
                </div>

              </div>
            </div> : <div className='col-md-6 jumberton'></div>}

            <div className='col-md-6'>
              <div className='product-detail'>
                <h3 className='product-title'>{itemData.title}</h3>
                <h4 className='sub-title'>{itemData.subTitle}</h4>
                <div className='qty-left'>Only {itemData.quantity} left</div>
                <div className='reviews'>
                  <div className='starsRating'>
                    <span style={{ width: `${itemData.rating * 20}%` }}></span>
                  </div>
                  <div className='rating'><span>({itemData.rating})</span></div>
                </div>
                {/* AUCTION & AUCTION WITH Buy NFT START */}
                <div className='product-price'>
                  {itemData.priceType == "2" && itemData.auctionTime !== 'Expired' ?
                    <div className='bid-section'>
                      {!this.props.ethPriceState ? <h4>Price: {usdSymbol} {itemData.priceUsd}</h4> :
                        <h4>Price:{ethSymbol} {(itemData.priceUsd / this.state.ethereum).toFixed(4)}</h4>}

                    </div> : ''}

                  {Number(itemData.quantity) > 0 && (itemData.priceType == "2" || itemData.priceType == "1") && itemData.auctionTime !== 'Expired' ?
                    <div className='bid-section'>
                      {!this.props.ethPriceState ? <h4>{itemData.last_bid === 0 ? 'Starting ' : ''}Bid: {usdSymbol}{itemData.bidPriceUsd}</h4> :
                        <h4>{itemData.last_bid === 0 ? 'Starting ' : ''}Bid: {usdSymbol}{(itemData.bidPriceUsd / this.state.ethereum).toFixed(4)}</h4>}

                      <div className='input-group '>
                        <div className='input-group-prepend'>
                          <span className='input-group-text' id='basic-addon1'>{usdSymbol}</span>
                        </div>
                        <input type='number' className='form-control' placeholder='Enter Price' name='EnterBidPrice'
                          value={EnterBidPrice} aria-describedby='basic-addon1' step='0.0001' min={Number(itemData.minimum_bid) + Number(itemData.minimum_bid * bidMaxVal)} onChange={this.handleChangeBidPrice} required />
                      </div>
                      {this.state.errors ? <div className='alert alert-danger mt-1'>{this.state.errors}</div> : ''}
                      <div className='min-bid'>Min. Bid: {usdSymbol}{(Number(itemData.minimum_bid) + Number(itemData.minimum_bid * bidMaxVal)).toFixed(3)}</div>
                      {!this.state.isAuthenticated ? <a className='btn-default hvr-bounce-in' data-toggle='modal' data-target='.bd-example-modal-lg'><span className='icon'>
                        <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                      </span>Place Bid</a> :
                        this.state.smallLoader ? <SmallLoader /> : <button className='btn-default hvr-bounce-in' onClick={this.handleSubmitBid}><span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>Place Bid</button>}

                    </div>
                    : itemData.priceType == "0" ? <div className='bid-section'>
                      {!this.props.ethPriceState ? <h4>Price: {usdSymbol} {itemData.priceUsd}</h4> :
                        <h4>Price:{ethSymbol} {(itemData.priceUsd / this.state.ethereum).toFixed(4)}</h4>}

                    </div> : ''}

                  {(Number(itemData.quantity) > 0 && (itemData.priceType == "1" || itemData.priceType == "2")) ?
                    <div className='seller-info'>
                      <br />
                      <div className='item'>
                        <span className='title'>Time Left: </span>
                        <span className='value' id='timer'>
                          {itemData.auctionTime !== 'Expired' ?
                            <Countdown
                              date={new Date(Number(itemData.auctionTime) * 1000).getTime()}
                              renderer={renderer}
                            />
                            : 'Expired'}
                        </span>
                      </div>
                      <div className='item'>
                        <span className='title'>Bids:</span>
                        <span className='value'>{itemData.total_bid}</span>
                      </div>
                      {itemData.lastBidUser ? <div className='item'>
                        <span className='title'>Last Bid User: </span>
                        <span className='value'>{itemData.lastBidUser}</span>
                      </div> : ''}
                    </div> : ''}

                </div>
                {/* AUCTION & AUCTION WITH Buy NFT END */}

                <div className='description'>
                  <h5>Description</h5>
                  <p>{itemData.description}</p>
                </div>
                <div className="d-flex mb-3">
                  {itemData.currentOwner !== accountId ? <div>
                    {!this.state.isAuthenticated ?
                      <button className='btn-default hvr-bounce-in' data-toggle='modal' data-target='.bd-example-modal-lg'><span className='icon'>{/* LOGIN CASE */}
                        <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                      </span>Buy NFT</button> :

                      itemSold ?
                        <button className='btn btn-danger hvr-bounce-in' disabled>
                          <span className='icon'> {/* SOLD CASE */}
                            <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                          </span>Sold
                        </button> :
                        !itemSold && (itemData.priceType == "2") && itemData.auctionTime !== 'Expired' ?
                          <button className='btn-default hvr-bounce-in' data-toggle='modal'
                            data-target='.cart'> {/* AUCTION WITH BUY IF NOT EXPIRED CASE */}
                            <span className='icon'>
                              <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                            </span>Buy NFT</button> :
                          !itemSold && (itemData.priceType !== 0) && itemData.auctionTime === 'Expired' ?

                            itemData.wonBidUserId === userId ?
                              <button className='btn-default hvr-bounce-in' data-toggle='modal'
                                data-target='.cart'> {/* AUCTION AND AUCTION WITH BUY IF EXPIRED  AND WINNDER CASE */}
                                <span className='icon'>
                                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                                </span>Buy NFT</button>
                              :
                              <button className='btn btn-danger hvr-bounce-in' disabled>
                                <span className='icon'> {/* AUCTION AND AUCTION WITH BUY IF EXPIRED CASE */}
                                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                                </span>Expired
                              </button>
                            :
                            !itemSold && (itemData.priceType == "0") ?
                              <button className='btn-default hvr-bounce-in' data-toggle='modal'
                                data-target='.cart'> {/* BUY ONLY CASE */}
                                <span className='icon'>
                                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                                </span>Buy NFT</button> : ''
                    }

                  </div> : itemData.currentOwner === accountId ?
                    itemSold ?
                      <button className='btn btn-danger hvr-bounce-in' disabled>
                        <span className='icon'> {/* SOLD CASE */}
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>Sold
                      </button> : '' : ''}


                  <button className='ml-3 btn-default hvr-bounce-in' data-toggle='modal' data-target='.buy-busd' >
                    <span className='icon'> {/* SOLD CASE */}
                      <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                    </span>Add Funds
                  </button>
                </div>

                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Top seller</span>
                    <span className='value'><img src={Badges} alt='Badge' className='img-fluid' /></span>
                  </div>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <Link to={{ pathname: `/user/${itemData.seller}` }} className='value'>{itemData.seller}</Link>
                  </div>
                  <div className='item'>
                    <span className='title'>Token ID:</span>
                    <span className='value'>{itemData.tokenId}</span>
                  </div>
                  <div className='item'>
                    <span className='title'>Store:</span>
                    <a><span className='value'>{itemData.store}</span></a>
                  </div>
                  <div className='item'>
                    <span className='title'>Copyright Transferred:</span>
                    <span className='value'>{itemData.transferCopyrightWhenPurchased === '0' ? 'No' : 'Yes'}</span>
                  </div>
                  <div className='item'>
                    <span className='title'>Downloadable file:</span>
                    <span className='value'>{itemData.downloadableFile === '0' ? 'No' : 'Yes'}</span>
                  </div>
                  <div className='item'>
                    <span className='title'>Resellable:</span>
                    <span className='value'>{itemData.isAllowBuyerToResell === '0' ? 'No' : 'Yes'}</span>
                  </div>
                </div>
                <div className='social-links'>
                  <ul>
                    {itemData.facebook !== (null || undefined) ? <li>
                      <a href={itemData.facebook} target='blank'>
                        <img src={FacebookLogo} alt='Facebook' className='hvr-float-shadow img-fluid' />
                      </a>
                    </li> : ''}
                    {itemData.instagram !== null ? <li>
                      <a href={itemData.instagram} target='blank'>
                        <img src={InstagramLogo} alt='Instagram' className='hvr-float-shadow img-fluid' />
                      </a>
                    </li> : ''}
                    {itemData.twitter !== null ? <li>
                      <a href={itemData.twitter} target='blank'>
                        <img src={TwitterLogo} alt='Twitter' className='hvr-float-shadow img-fluid' />
                      </a>
                    </li> : ''}
                    {itemData.youtube !== null ? <li>
                      <a href={itemData.youtube} target='blank'>
                        <img src={YoutubeLogo} alt='Youtube' className='hvr-float-shadow img-fluid' />
                      </a>
                    </li> : ''}
                  </ul>
                </div>
                <div className='report'>
                  <p>Anything wrong with this item?
                    {!this.state.isAuthenticated ? <button type='button' className=' btn-secondary' data-toggle='modal'
                      data-target='.bd-example-modal-lg'>Report this item</button> :
                      <button type='button' className=' btn-secondary' data-toggle='modal' data-target='.report-item'>Report this item</button>}</p>
                </div>
              </div>
            </div>
          </div>
          <section className='item-metadata'>
            <div className='section-title'>
              <h2>Item metadata</h2>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='metadata-info'>
                  <h6>Contract Address</h6>
                  <p>{contractAddress}</p>
                  <h6>Token ID</h6>
                  <p>{itemData.tokenId}</p>
                  <h6>Original Image</h6>
                  {itemData.mediaFiles && Object.keys(itemData.mediaFiles).length > 0 ?
                    itemData.mediaFiles.map((item, i) => {
                      return <p key={i}>{item.ipfsImageHash}</p>
                    }) : ''}
                  <h6>Original Creator</h6>
                  <p>{itemData.originalCreator}</p>

                  {itemData.originalCreator !== itemData.currentOwner && itemSold ?
                    <span>
                      <h6>Current Owner</h6>
                      <p>{itemData.currentOwner}</p>
                    </span> : ''}
                </div>
              </div>
              <div className='col-md-6'>
                {metaData && Object.keys(metaData).length > 0 ? <div className='token-metadata'>
                  <h5>Token Metadata</h5>
                  <div className='content'>
                    <pre>{'{'}{'\n'}<span className='key'>'symbol':</span>
                      <span className='string'>{metaData.symbol}</span>,{'\n'}
                      <span className='key'>'image':</span>
                      <span className='string'>{metaData.image}</span>,{'\n'}
                      <span className='key'>'animation_url':</span>
                      <span className='string'>{metaData.animation_url ? metaData.animation_url : metaData.image}</span>,{'\n'}
                      <span className='key'>'copyright_transfer':</span>
                      <span className='boolean'>{metaData.copyright_transfer.toString()}</span>,{'\n'}
                      <span className='key'>'address':</span>
                      <span className='string'>{metaData.address}</span>,{'\n'}
                      <span className='key'>'tokenId':</span>
                      <span className='string'>{itemData.tokenId}</span>,{'\n'}
                      <span className='key'>'resellable':</span>
                      <span className='boolean'>{metaData.resellable.toString()}</span>,{'\n'}
                      <span className='key'>'original_creator':</span>
                      <span className='string'>{metaData.original_creator}</span>,{'\n'}
                      <span className='key'>'edition_number':</span>
                      <span className='number'>{metaData.edition_number}</span>,{'\n'}
                      <span className='key'>'description':</span>
                      <span className='string'>{metaData.description}</span>,{'\n'}
                      <span className='key'>'auctionLength':</span>
                      <span className='string'>{metaData.auctionLength}</span>,{'\n'}
                      <span className='key'>'title':</span>
                      <span className='string'>{metaData.title}</span>,{'\n'}
                      <span className='key'>'url':</span>
                      <span className='string'>{metaData.url}</span>,{'\n'}
                      <span className='key'>'file_key':</span>
                      <span className='string'>{metaData.file_key}</span>,{'\n'}
                      <span className='key'>'apiURL':</span>
                      <span className='string'>{metaData.apiURL}</span>,{'\n'}
                      <span className='key'>'subtitle':</span>
                      <span className='string'>{metaData.subtitle}</span>,{'\n'}
                      <span className='key'>'name':</span>
                      <span className='string'>{metaData.name ? metaData.name : metaData.title}</span>,{'\n'}
                      <span className='key'>'auctionType':</span>
                      <span className='string'>{metaData.auctionType}</span>,{'\n'}
                      <span className='key'>'category':</span>
                      <span className='string'>{metaData.category}</span>,{'\n'}
                      <span className='key'>'edition_total':</span>
                      <span className='number'>{metaData.edition_total}</span>,{'\n'}
                      <span className='key'>'gasless':</span>
                      <span className='string'>{metaData.gasless.toString()}</span>{'\n'}{'}'}</pre>
                  </div>
                </div> : ''}
              </div>
            </div>
          </section>
          {related_product && Object.keys(related_product).length > 0 ? <section className='related-products'>
            <div className='section-title'>
              <h2>Other Items like this</h2>
            </div>
            {related_product > 5 ? <Slider {...settings} className='related-product-list'>
              {related_product.map((item, i) => {
                let mediaType = JSON.parse(item.productMedia);
                return <div className='product-item mb-3' key={i}>
                  <div className='product-wrap'>
                    <div className='image'>
                      {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                        videoUrl={item.ipfsImageHash}

                        className="img-fluid"
                        alt={item.title}
                      />}
                    </div>
                    <div className='product-info'>
                      <h6 className='title'>{item.title} </h6>
                      <div className='seller-info'>
                        <div className='item'>
                          <span className='title'>Seller:</span>
                          <Link to={{ pathname: `/user/${item.seller}` }} className='value'>{item.seller}</Link>
                        </div>
                      </div>
                    </div>
                    <div className='actions'>
                      {this.props.ethPriceState ?
                        <span className='price'>{ethSymbol} {(item.priceUsd / this.state.ethereum).toFixed(4)}</span> :
                        <span className='price'>{usdSymbol} {item.priceUsd}</span>}
                      <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}
                        className='btn-default hvr-bounce-in' onClick={() => this.setState({ id: item.id })}><span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>View Details</Link>
                    </div>
                  </div>
                </div>
              })}
            </Slider> : <div className='related-product-list no-slider'>
              {related_product.map((item, i) => {
                let mediaType = JSON.parse(item.productMedia);
                return <div className='product-item mb-3' key={i}>
                  <div className='product-wrap'>
                    <div className='image'>
                      {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" /> : <VideoImageThumbnail snapshotAtTime={0}
                        videoUrl={item.ipfsImageHash}

                        className="img-fluid"
                        alt={item.title}
                      />}
                    </div>
                    <div className='product-info'>
                      <h6 className='title'>{item.title} </h6>
                      <div className='seller-info'>
                        <div className='item'>
                          <span className='title'>Seller:</span>
                          <Link to={{ pathname: `/user/${item.seller}` }} className='value'>{item.seller}</Link>
                        </div>
                      </div>
                    </div>
                    <div className='actions'>
                      {this.props.ethPriceState ?
                        <span className='price'>{ethSymbol} {(item.priceUsd / this.state.ethereum).toFixed(4)}</span> :
                        <span className='price'>{usdSymbol} {item.priceUsd}</span>}
                      <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}
                        className='btn-default hvr-bounce-in' onClick={() => this.setState({ id: item.id })}><span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>View Details</Link>
                    </div>
                  </div>
                </div>
              })}
            </div>}
          </section> : ''}
        </div>
        <CartModal Logo={Logo}
          Data={itemData}
          ethereum={this.state.ethereum}
          BidPrice={EnterBidPrice}
          productId={this.state.id}
          wonBidUserId={itemData.wonBidUserId}
          bidId={itemData.wonBidId}
          ethPrice={ethPrice}
          itemCheck={itemSold} />
        <ReportModal Logo={Logo} Data={itemData.reportAbuses} productId={this.props.match.params.id} />


      </>
    )
  }
}
const mapStateToProps = state => {
  return {
    loading: state.productDetailsReducer.loading,
    related_product: state.productDetailsReducer.related_product,
    itemData: state.productDetailsReducer.itemData,
    token: state.userReducer.token,
    ethPriceState: state.userReducer.ethPriceState,
  }
}
export default connect(mapStateToProps)(withRouter(ProductDetails));