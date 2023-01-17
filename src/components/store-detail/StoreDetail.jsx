import React, { Component } from 'react';
import Logo from './../../assets/img/olympusnft-logo.gif';
import Badges from './../../assets/img/badges.svg';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchStoresDetailsData } from './../../store/actions/actionStoreDetails'
import Loader from '../loader/Loader';
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import { usdSymbol, ethSymbol } from '../../constant/constant'
import VideoImageThumbnail from 'react-video-thumbnail-image';
const $ = window.jQuery;

class StoreDetail extends Component {

  state = {
    id: this.props.match.params.id,
    category: '',
    description: '',
    image: '',
    store_title: '',
    store_your_data: '',
    sub_title: '',
    total_items: '',
    user: '',
    items: [],
    loading: true,
    total_review: '',
    ethPriceState: false,
    ethereum: ''
  }

  componentDidMount() {
    $(window).scrollTop('0');
    this.ethereumCalculate()
    this.props.dispatch(fetchStoresDetailsData(this.props.match.params.id))
    if (!this.props.loading) {
      this.setState({
        id: this.props.itemData.id,
        category: this.props.itemData.category,
        description: this.props.itemData.description,
        image: this.props.itemData.storeImage,
        store_title: this.props.itemData.storeTitle,
        sub_title: this.props.itemData.subTitle,
        total_items: this.props.itemData.total_items,
        total_review: '',
        user: this.props.itemData.owner,
        items: this.props.items,
        loading: this.props.loading,
        ethPriceState: this.props.ethPriceState,
      })
    }
  }

  ethereumCalculate = async () => {
    let ethereum = await EthPriceCalculation()
    this.setState({ ethereum })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.itemData !== nextProps.itemData) {
      return {
        loading: nextProps.loading,
        items: nextProps.items,
        id: nextProps.itemData.id,
        category: nextProps.itemData.category,
        description: nextProps.itemData.description,
        image: nextProps.itemData.storeImage,
        store_title: nextProps.itemData.storeTitle,
        sub_title: nextProps.itemData.subTitle,
        total_items: nextProps.itemData.totalItems,
        total_review: nextProps.itemData.totalReview,
        rating_avg: (nextProps.itemData.ratingAvg) ? (nextProps.itemData.ratingAvg * 10) : 0,
        user: nextProps.itemData.owner,
        ethPriceState: nextProps.ethPriceState
      }
    }
    return null
  }

  render() {
    const { category, image, description, store_title, sub_title, user, loading, total_items, total_review, items, ethereum } = this.state
    if (loading) {
      return <Loader />
    } return (
      <>
        <div className='main-wrapper main-padding store'>
          <div className='breadcrumb'>
            <div className='breadcrumb-item'><Link to='/'>Home</Link></div>
            <div className='breadcrumb-item'><a>{category}</a></div>
            <div className='breadcrumb-item active' aria-current='page'>{store_title}</div>
          </div>
          <div className='row'>
            <div className='col-md-5'>
              <div className='product-image'>
                <div className='image'>
                  <img src={image} alt={store_title} className='img-fluid' />
                </div>
              </div>
            </div>
            <div className='col-md-7'>
              <div className='product-detail'>
                <h3 className='product-title'>{store_title}</h3>
                <h4 className='sub-title'>{sub_title}</h4>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Top seller: </span>
                    <span className='value'><img src={Badges} alt='Top' className='img-fluid' /></span>
                  </div>
                  <div className='item'>
                    <span className='title'>Owner: </span>
                    <Link className='value' to={`/user/${user}`}>{user}</Link>
                  </div>

                </div>

                <div className='description'>
                  <h5>Description</h5>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>
          <section className='related-products'>
            <div className='section-title'>
              {total_items > 0 ? <h2>Products for sale in this store</h2> :
                <h2>Currently this store have no products</h2>}
            </div>
            <div className='related-product-list'>
              {items && items.length > 0 && total_items > 0 ? items.map((item, i) => {
                let mediaType = JSON.parse(item.productMedia);
                return <div className='product-item' key={i}>
                  <div className='product-wrap'>
                    <div className='image'>
                      {mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.productTitle} className="img-fluid" width="50px" height="50px" /> : <VideoImageThumbnail snapshotAtTime={0}
                        videoUrl={item.ipfsImageHash}
                                
                        className="img-fluid"
                        alt={item.productTitle}
                      />}
                      
                    </div>
                    <div className='product-info'>
                      <h6 className='title'>{item.productTitle} </h6>
                      <p>{item.productSubTitle} </p>
                      <div className='seller-info'>
                        <div className='item'>
                          <span className='title'>Seller:</span>
                          <Link className='value' to={`/user/${item.seller}`}>{item.seller}</Link>
                        </div>
                      </div>
                    </div>
                    <div className='actions'>
                      {!this.props.ethPriceState ? <span className='price'>{usdSymbol} {item.priceUsd}</span> :
                        <span className='price'>{ethSymbol} {(item.priceUsd / ethereum).toFixed(4)}</span>}
                      <Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }}
                        className='btn-default hvr-bounce-in' ><span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>Buy NFT</Link>
                    </div>
                  </div>
                </div>
              }) : ''}
            </div>
          </section>
        </div>
      </>
    )
  }
}
const mapStateToProps = state => {
  return {
    loading: state.storeDetailsReducer.loading,
    itemData: state.storeDetailsReducer.itemData,
    items: state.storeDetailsReducer.items,

    ethPriceState: state.userReducer.ethPriceState,
  }
}
export default connect(mapStateToProps)(StoreDetail);