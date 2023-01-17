import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Logo from './../../assets/img/olympusnft-logo.gif';

function BannerSlide(props) {

  if (!props.loading) {
    return <section className='banner-area'>
      {props.BannerImages && Object.keys(props.BannerImages).length !== 0 ? props.BannerImages.map((item, i) => {
        return <div className='artist-list' key={i}>
          <div className='artist'>
            <div className='image'>
              <img src={item.profileImage} alt='Image 1' className='img-fluid' />
            </div>
            <div className='content'>
              <h2>{item.userType === 1 ? 'Investor' : item.userType === 2 ? 'Artist' : 'Musician'}</h2>
              <Link to={{ pathname: `/user/${item.sellerName}` }} className='btn-default hvr-bounce-in'>
                <span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>View Details</Link>
            </div>
          </div>
        </div>
      }) : ''}
    </section>
  } return null
}
const mapStateToProps = state => {
  return {
    BannerImages: state.siteSettingReducer.bannerImages,
    loading: state.siteSettingReducer.bannerLoading
  }
}

export default connect(mapStateToProps)(BannerSlide)