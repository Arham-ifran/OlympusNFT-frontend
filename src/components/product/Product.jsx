import React from 'react';
import Logo from './../../assets/img/olympusnft-logo.gif'
import ArtFour from './../../assets/img/art-4.png'
import FacebookLogo from './../../assets/img/facebook.png'
import InstagramLogo from './../../assets/img/instagram.png'
import TwitterLogo from './../../assets/img/twitter.png'
import YoutubeLogo from './../../assets/img/youtube.png'
import Badges from './../../assets/img/badges.svg';

function Product() {
  return (
    <div className='main-wrapper main-padding product'>
      <div className='breadcrumb'>
        <div className='breadcrumb-item'><a href='index.html'>Home</a></div>
        <div className='breadcrumb-item'><a href='category.html'>Music</a></div>
        <div className='breadcrumb-item active' aria-current='page'>Pre Matthattan Beats</div>
      </div>
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
              <div className='price'>$127.69
                <span className='eth'>or 0.05 BUSD</span>
              </div>
            </div>
            <div className='description'>
              <h5>Description</h5>
              <p>I am openly disclosing to you that this is a scam. This NFT is truly worthless and always
                will be. You have no recourse. Thank you!</p>
            </div>
            <div className='add-to-cart'>
              <button className='btn-default hvr-bounce-in' data-toggle='modal' data-target='.cart'><span className='icon'>
                <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
              </span>Buy NFT</button>
            </div>
            <div className='seller-info'>
              <div className='item'>
                <span className='title'>Top seller:</span>
                <span className='value'><img src={Badges} alt='' className='img-fluid' /></span>
              </div>
              <div className='item'>
                <span className='title'>Seller:</span>
                <a><span className='value'>emark</span></a>
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
                <a><span className='value'>Mintable Gasles</span></a>
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
      <section className='item-metadata'>
        <div className='section-title'>
          <h2>Item metadata</h2>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='metadata-info'>
              <h6>Contract Address</h6>
              <p>0x8c5aCF6dBD24c66e6FD44d4A4C3d7a2D955AAad2</p>
              <h6>Token ID</h6>
              <p>101156980990714422702000610363792058551611801226645330677391618780055482825000</p>
              <h6>Token Name</h6>
              <p>Where there is hope, miracles bloom</p>
              <h6>Original Image</h6>
              <p>https://d1iczm3wxxz9zd.cloudfront.net/014a8879-bae4-4e76-833e-794b9b46fd62/000000-0000000000/101156980990714422702000610363792058551611801226645330677391618780055482825000/ITEM_PREVIEW1.png</p>
              <h6>Original Creator</h6>
              <p>0xDfa4d280C1dd6E4AB7C9ceB7ac86E485AD97BCEA</p>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='token-metadata'>
              <h5>Token Metadata</h5>
              <div className='content'>
                <pre>{'{'}{'\n'} <span className='key'>'symbol':</span> <span className='string'>'Mintable Gasless store'</span>,{'\n'} <span className='key'>'image':</span> <span className='string'>'https://d1iczm3wxxz9zd.cloudfront.net/014a8879-bae4-4e76-833e-794b9b46fd62/000000-0000000000/101156980990714422702000610363792058551611801226645330677391618780055482825000/ITEM_PREVIEW1.png'</span>,{'\n'} <span className='key'>'animation_url':</span> <span className='string'>''</span>,{'\n'} <span className='key'>'royalty_amount':</span> <span className='number'>500</span>,{'\n'} <span className='key'>'copyright_transfer':</span> <span className='boolean'>true</span>,{'\n'} <span className='key'>'address':</span> <span className='string'>'0x8c5aCF6dBD24c66e6FD44d4A4C3d7a2D955AAad2'</span>,{'\n'} <span className='key'>'tokenId':</span> <span className='string'>'101156980990714422702000610363792058551611801226645330677391618780055482825000'</span>,{'\n'} <span className='key'>'resellable':</span> <span className='boolean'>true</span>,{'\n'} <span className='key'>'original_creator':</span> <span className='string'>'0xDfa4d280C1dd6E4AB7C9ceB7ac86E485AD97BCEA'</span>,{'\n'} <span className='key'>'edition_number':</span> <span className='number'>1</span>,{'\n'} <span className='key'>'description':</span> <span className='string'>'&lt;p&gt;Where there is hope, miracles bloom&lt;/p&gt;'</span>,{'\n'} <span className='key'>'auctionLength':</span> <span className='string'>'604800'</span>,{'\n'} <span className='key'>'title':</span> <span className='string'>'Where there is hope, miracles bloom'</span>,{'\n'} <span className='key'>'url':</span> <span className='string'>'https://metadata.mintable.app/mintable_gasless/101156980990714422702000610363792058551611801226645330677391618780055482825000'</span>,{'\n'} <span className='key'>'file_key':</span> <span className='string'>''</span>,{'\n'} <span className='key'>'apiURL':</span> <span className='string'>'mintable_gasless/'</span>,{'\n'} <span className='key'>'subtitle':</span> <span className='string'>'Where there is hope, miracles bloom'</span>,{'\n'} <span className='key'>'name':</span> <span className='string'>'Where there is hope, miracles bloom'</span>,{'\n'} <span className='key'>'auctionType':</span> <span className='string'>'Auction'</span>,{'\n'} <span className='key'>'category':</span> <span className='string'>'Domains'</span>,{'\n'} <span className='key'>'edition_total':</span> <span className='number'>1</span>,{'\n'} <span className='key'>'gasless':</span> <span className='boolean'>true</span>{'\n'}{'}'}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='related-products'>
        <div className='section-title'>
          <h2>Other Items like this</h2>
        </div>
        <div className='related-product-list'>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
          <div className='product-item'>
            <div className='product-wrap'>
              <div className='image'>
                <img src={ArtFour} alt='' className='img-fluid' />
              </div>
              <div className='product-info'>
                <h6 className='title'>#006 ☵ ☳ </h6>
                <div className='seller-info'>
                  <div className='item'>
                    <span className='title'>Seller:</span>
                    <span className='value'>emark</span>
                  </div>
                </div>
              </div>
              <div className='actions'>
                <span className='price'>$117.660</span>
                <a href='product.html' className='btn-default hvr-bounce-in'><span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Buy NFT</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Product;