import Logo from './../../assets/img/olympusnft-logo.gif'
import FacebookLogo from './../../assets/img/facebook.png'
import InstagramLogo from './../../assets/img/instagram.png'
import TwitterLogo from './../../assets/img/twitter.png'
import YoutubeLogo from './../../assets/img/youtube.png'

export default function ProductModal() {
  return (
    <>
      <div className='modal fade product-bid' tabIndex={-1} role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>
        <div className='modal-dialog modal-xl modal-dialog-centered'>
          <div className='modal-content'>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>×</span>
            </button>
            <div className='modal-body'>
              <div className='row'>
                <div className='col-lg-6'>
                  <div className='product-image'>
                    <div id='custCarousel' className='carousel slide' data-ride='carousel'>
                      {/* slides */}
                      <div className='carousel-inner'>
                        <div className='carousel-item active'> <img src='https://i.imgur.com/weXVL8M.jpg' alt='Hills' className='img-fluid' />
                        </div>
                        <div className='carousel-item'> <img src='https://i.imgur.com/Rpxx6wU.jpg' alt='Hills' className='img-fluid' /> </div>
                        <div className='carousel-item'> <img src='https://i.imgur.com/83fandJ.jpg' alt='Hills' className='img-fluid' /> </div>
                        <div className='carousel-item'> <img src='https://i.imgur.com/JiQ9Ppv.jpg' alt='Hills' className='img-fluid' /> </div>
                      </div> {/* Left right */} <a className='carousel-control-prev' href='#custCarousel' data-slide='prev'>
                        <span className='carousel-control-prev-icon' /> </a> <a className='carousel-control-next' href='#custCarousel' data-slide='next'> <span className='carousel-control-next-icon' />
                      </a>
                      {/* Thumbnails */}
                      <ol className='carousel-indicators list-inline'>
                        <li className='list-inline-item active'> <a id='carousel-selector-0' className='selected' data-slide-to={0} data-target='#custCarousel'> <img src='https://i.imgur.com/weXVL8M.jpg' className='img-fluid' /> </a> </li>
                        <li className='list-inline-item'> <a id='carousel-selector-1' data-slide-to={1} data-target='#custCarousel'> <img src='https://i.imgur.com/Rpxx6wU.jpg' className='img-fluid' /> </a> </li>
                        <li className='list-inline-item'> <a id='carousel-selector-2' data-slide-to={2} data-target='#custCarousel'> <img src='https://i.imgur.com/83fandJ.jpg' className='img-fluid' /> </a> </li>
                        <li className='list-inline-item'> <a id='carousel-selector-2' data-slide-to={3} data-target='#custCarousel'> <img src='https://i.imgur.com/JiQ9Ppv.jpg' className='img-fluid' /> </a> </li>
                      </ol>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='product-detail'>
                    <h3 className='product-title'>Pre Matthattan Beats</h3>
                    <h4 className='sub-title'>Pre Matthattan Beats</h4>
                    <div className='reviews'>
                      <div className='stars'>
                        <span className='fas fa-star' />
                        <span className='fas fa-star' />
                        <span className='fas fa-star' />
                        <span className='fas fa-star' />
                        <span className='fas fa-star' />
                      </div>
                      <div className='rating'><span>(5.0)</span></div>
                    </div>
                    <div className='product-price'>
                      <div className='bid-section'>
                        <h4>Starting Bid: $104.6</h4>
                        <p>or 0.05 ETH</p>
                        <div className='input-group '>
                          <div className='input-group-prepend'>
                            <span className='input-group-text' id='basic-addon1'>$</span>
                          </div>
                          <input type='text' className='form-control' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1' />
                        </div>
                        <div className='min-bid'>Min. Bid: $115.94</div>
                        <button className='btn-default hvr-bounce-in'><span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>Place Bid</button>
                        <div className='seller-info'>
                          <div className='item'>
                            <span className='title'>Time Left:</span>
                            <span className='value' id='timer'>
                              <span><span id='days'>10</span>:</span>
                              <span><span id='hours'>06</span>:</span>
                              <span><span id='minutes'>11</span>:</span>
                              <span><span id='seconds'>22</span></span>
                            </span>
                          </div>
                          <div className='item'>
                            <span className='title'>Bids:</span>
                            <span className='value'>0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='description'>
                      <h5>Description</h5>
                      <p>I am openly disclosing to you that this is a scam. This NFT is truly worthless and always
                        will be. You have no recourse. Thank you!</p>
                    </div>
                    <div className='seller-info'>
                      <div className='item'>
                        <span className='title'>Top seller:</span>
                        <span className='value'><img src='img/badges.svg' alt='' className='img-fluid' /></span>
                      </div>
                      <div className='item'>
                        <span className='title'>Seller:</span>
                        <a ><span className='value'>emark</span></a>
                      </div>
                      <div className='item'>
                        <span className='title'>Token ID:</span>
                        <span className='value'>101156</span>
                      </div>
                      <div className='item'>
                        <span className='title'>Edition:</span>
                        <span className='value'>1/1</span>
                      </div>
                      <div className='item'>
                        <span className='title'>Store:</span>
                        <a ><span className='value'>Mintable Gasles</span></a>
                      </div>
                      <div className='item'>
                        <span className='title'>Copyright Transferred:</span>
                        <span className='value'>Yes</span>
                      </div>
                      <div className='item'>
                        <span className='title'>Downloadable file:</span>
                        <span className='value'>No</span>
                      </div>
                      <div className='item'>
                        <span className='title'>Resellable:</span>
                        <span className='value'>Yes</span>
                      </div>
                    </div>
                    <div className='social-links'>
                      <ul>
                        <li>
                          <a href='https://www.facebook.com/OlympusNFTNFT/'>
                            <img src={FacebookLogo} alt='' className='hvr-float-shadow img-fluid' />
                          </a>
                        </li>
                        <li>
                          <a href='https://www.instagram.com/whitelabeltnftnft/'>
                            <img src={InstagramLogo} alt='' className=' hvr-float-shadow img-fluid' />
                          </a>
                        </li>
                        <li>
                          <a href='https://mobile.twitter.com/whitelabeltnft_nft'>
                            <img src={TwitterLogo} alt='' className='hvr-float-shadow img-fluid' />
                          </a>
                        </li>
                        <li>
                          <a href='https://www.youtube.com/channel/UCklEUeW2gGA0oXCKFt80sxA'>
                            <img src={YoutubeLogo} alt='' className=' hvr-float-shadow img-fluid' />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className='report'>
                      <p>Anything wrong with this item?<button type='button' className='btn-secondary hvr-bounce-in' data-toggle='modal' data-target='.report-item'>Report this item</button></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
