import React, { Component, Fragment } from 'react';
import Loader from '../loader/Loader';
import { UpdateItemsAPi, AuctionLengthAndCategoriesApi, EthereumPriceApi, } from './../../container/Api/api';
import { editItemValidation } from './validation';
import { Redirect, withRouter } from 'react-router-dom';
import Logo from './../../assets/img/olympusnft-logo.gif';
import TabLogoColor from './../../assets/img/tab-logo-color.png';
import Tablogo from './../../assets/img/tab-logo.png';
import TagsInput from 'react-tagsinput';
import { Message, ErrorHandler } from './../../utils/message';
import { readContractByName } from "../../utils/contracts";
import SmallLoader from '../loader/SmallLoader';
import Web3 from 'web3'
import { currentPrice, networkName, etheriumProvider, ethSymbol } from "../../constant/constant";
const $ = window.jQuery
class EditItem extends Component {
  state = {
    data: [],
    product_id: '',
    category_id: '',
    title: '',
    sub_title: '',
    tags: [],
    description: '',
    files: '',
    imagePreviewUrl: '',
    imageErr: '',
    private_files: '',
    privateImagePreviewUrl: '',
    privateImageErr: '',
    is_private_files: false,
    price_type: '',
    price_usd: '',
    price_eth: 0,
    bid_price_usd: '',
    bid_price_eth: 0,
    auction_length_id: '',
    categories: [],
    auctions: [],
    fixed: true,
    auction: false,
    auction_with_buy: false,
    ethereum: '',
    loading: true,
    isSubmitted: false,
    errors: '',
    success: false,
    store: '',
    public_files: [],
    smallLoader: false,
    tagsErrorMessage: '',
  };

  async componentDidMount() {
    $(window).scrollTop('0');
    let res = await AuctionLengthAndCategoriesApi();
    try {
      if (res.data.status === 1) {
        this.setState({
          categories: res.data.data.categories,
          auctions: res.data.data.auction_length,
        });
      }
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.clear()
        this.props.history.push('/')
      }
    }
    let storedTags = []
    let state = this.props.location.state ? this.props.location.state : { loading: true, data: [] };
    if (this.props.location.state) {
      storedTags.push(this.props.location.state.data[0].listing_tag)
      this.setState({
        data: state.data,
        product_id: state.id,
        loading: false,
        category_id: state.data[0].category_id,
        title: state.data[0].title,
        sub_title: state.data[0].sub_title,
        description: state.data[0].description,
        bid_price_usd: state.data[0].bid_price_usd,
        price_eth: state.data[0].price_eth,
        price_type: state.data[0].price_type,
        price_usd: state.data[0].price_usd,
        auction_length_id: state.data[0].auction_length_id,
        imagePreviewUrl: state.data[0].media_files[0].ipfsImageHash,
        store: state.data[0].store,
        tags: storedTags
      });
    }
    this.calculateEthereumPrice();
  }

  calculateEthereumPrice = async () => {
    let res = await EthereumPriceApi();
    if (res.status === 200) {
      let ethereum = res.data[currentPrice].usd;
      this.setState({ ethereum });
      if (this.state.price_usd > 0 || this.state.bid_price_usd > 0) {
        let price_eth = this.state.price_usd / ethereum;
        let bid_price_eth = this.state.bid_price_usd / ethereum;
        this.setState({ price_eth, bid_price_eth });
      }
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errors: '' });
    if (e.target.name === 'price_usd' || 'bid_price_usd') {
      this.calculateEthereumPrice();
    } else if (e.target.name === 'bid_price_usd') {
      this.calculateEthereumPrice();
    } else if (e.target.name === 'is_private_files') {
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      this.setState({ is_private_files: value });
    }
  };

  handleFileInput = async (e) => {
    e.preventDefault()
    let files = e.target.files
    let public_files = await this.readFilesAsBuffer(files);
    this.setState({ files, public_files })
  };

  readFilesAsBuffer = async (files) => {
    try {
      let promises = [];
      for (let index = 0; index < files.length; index++) {
        promises.push(this.readFilePromise(files[index]))
      }
      let data = await Promise.all(promises);
      return data;
    } catch (error) {
      console.log(error)
    }

  }

  readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          resolve({
            buffer: Buffer(reader.result),
            fileType: file.type,
            filesName: file.name,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  handlePrivateFileInput = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file.type === ('image/jpeg' || 'image/png' || 'image/gif' || 'image/jpg' || 'image/svg' || 'video/mp4')) {
      reader.onloadend = () => {
        this.setState({
          private_files: file,
          privateImagePreviewUrl: reader.result,
          privateImageErr: '',
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({ imageErr: 'Please select png or jpeg image file' });
    }
  };

  handleChangeTags = (tags) => {
    this.setState({ tags });
  };

  handleFixed = () => {
    this.setState(() => {
      return { price_type: 0, fixed: true, auction: false, auction_with_buy: false, auction_length_id: '', bid_price_usd: '', bid_price_eth: 0, errors: '' }
    })
  }

  handleAuction = () => {
    this.setState(() => {
      return { price_type: 1, fixed: false, auction: true, auction_with_buy: false, price_usd: 0, price_eth: 0, errors: '' }
    })
  }

  handleAuctionWithBuy = () => {
    this.setState(() => {
      return { price_type: 2, fixed: false, auction: false, auction_with_buy: true, errors: '' }
    })
  }


  readContract = async () => {
    var $this = this;
    const web3 = new Web3(etheriumProvider)
    try {
      let { instance } = readContractByName("OlympusNFTMintableToken", networkName);
      let accounts = await web3.eth.getAccounts()
      let accountId = accounts[0];
      let tokenId = this.props.location.state.token_id;
      const msgParams = JSON.stringify({
        domain: {
          chainId: window.ethereum.networkVersion,
          name: 'OlympusNFT',
          verifyingContract: instance._address,
          version: '1',
        },
        message: {
          seller: accountId,
          expiryTime: this.state.auction_length_id ? this.state.auction_length_id : '0',
          _contract: instance._address,
          price: this.state.price_eth,
        },
        primaryType: 'OlympusNFT',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          OlympusNFT: [
            { name: 'seller', type: 'address' },
            { name: 'expiryTime', type: 'uint256' },
            { name: '_contract', type: 'address' },
            { name: 'price', type: 'string' },
          ]
        }
      });
      var from = accountId;
      var params = [from, msgParams];
      var method = 'eth_signTypedData_v3';
      web3.currentProvider.sendAsync(
        {
          method,
          params,
          from,
        },
        function (err, result) {
          if (err) {
            $this.props.history.push('/create-item')
            return Message('error', 'Meta Mask', "Transaction Denied")
          }
          if (result) {
            return $this.handleSubmitFormValues(tokenId, accountId, result.result)
          }
        }
      );

      this.setState({ smallLoader: false })
      return { tokenId, accountId }
    } catch (error) {
      console.log(error)
      Message('error', 'Error', 'Transaction failed, Please try again later.')
      this.setState({ smallLoader: false })
    }
  }
  uuid = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v;
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let isValidForm = this.validateForm();
    if (isValidForm) {
      this.setState({ smallLoader: true })
      try {
        this.setState({ isSubmitted: true, errors: undefined });
        const { isValid, errors } = editItemValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false, smallLoader: false });
          return false;
        } else {
          await this.readContract();
        }
      } catch (error) {
        this.setState({ errors: error.message, isSubmitted: false, smallLoader: false });
        return false;
      }
    }
  }


  handleSubmitFormValues = async (tokenId, accountId, transactionHash) => {
    let { user_id, category_id, title, sub_title, description, ipfsImageHash, private_files, price_type,
      price_usd, bid_price_usd, auction_length_id, is_private_files, public_files, store_id, tags } = this.state

    let body = new FormData();
    body.append('user_id', localStorage.getItem('id'));
    body.append('product_id', this.state.product_id);
    body.append('category_id', category_id);
    body.append('title', title);
    body.append('sub_title', sub_title);
    body.append('store_id', store_id ? store_id : '0Ne6p86ypV');
    body.append('description', description);
    body.append('listing_tag', tags);
    body.append('bid_price_usd', bid_price_usd);
    body.append('auction_length_id', auction_length_id);
    body.append('price_type', price_type)
    body.append('price_usd', price_usd)
    body.append('transaction_hash', transactionHash);
    body.append('relist_item', this.props.location.state.relisted ? 1 : '0');

    const res = await UpdateItemsAPi(body);
    this.setState({ smallLoader: true })
    try {
      if (res.data.status === 1) {
        let message = res.data.message;
        this.setState({ smallLoader: false, errors: '', success: true });
        Message('success', 'Success', message);
      } else if (res.data.status === 0) {
        this.setState(() => {
          return { smallLoader: false };
        });
        let error = res.data.message;
        Message('error', 'Sorry', error);
      }
    } catch (err) {
      Message('error', 'Sorry', 'Process Denied');
      window.location.reload(true)
    }
  }

  validateForm = () => {
    var form = document.getElementsByClassName('needs-validation-edit-item')[0];
    let isValid = true;
    if (form.checkValidity() === false) {
      isValid = false;
      form.classList.add('was-validated');
    }
    return isValid;
  }

  render() {
    const { imagePreviewUrl, privateImagePreviewUrl, success, loading, category_id, title, sub_title, description,
      price_usd, price_eth, bid_price_usd, bid_price_eth, ethereum, files, private_files, is_private_files,
      categories, auction_length_id, auctions, fixed, auction, auction_with_buy, store_id, tagsErrorMessage, price_type, errors, store } = this.state

    let imagePreview = null;
    if (files !== undefined && imagePreviewUrl) {
      imagePreview = (<img style={{ height: '120px', width: '90px' }} src={imagePreviewUrl} className='img-fluid' />);
    } else {
      imagePreview = null
    }

    let privateImagePreview = null;
    if (private_files !== undefined && privateImagePreviewUrl) {
      privateImagePreview = (<img style={{ height: '120px', width: '90px' }} src={privateImagePreviewUrl} className='img-fluid' />);
    } else {
      privateImagePreview = null
    }

    if (loading) {
      return <Loader />
    } else if (success) {
      return <Redirect to={this.props.location.state.relisted ? '/my-nft' : '/current-item-list'} />
    } return (
      <div className='main-wrapper main-padding create-store'>
        <div className='breadcrumb'>
          {/* <div className='breadcrumb-item'><Link to='/'>Home</Link></div>
          <div className='breadcrumb-item active' aria-current='page'>Sell</div> */}
        </div>

        <div className='container'>
          <div className='page-title'>
            <h2>{this.props.location.state.relisted ? "Update NFT" : "Edit Item"}</h2>
          </div>
          <div className='content-box'>
            <form className="needs-validation-edit-item" role='form' onSubmit={this.handleSubmit} noValidate>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <label>What kind of item are you making?</label>
                  <select className='form-control' name='category_id' value={category_id} onChange={this.handleChange} required>
                    <option value='' disabled>Select Category</option>
                    {categories.length > 1 ? categories.map(item => <option key={item.id} value={item.id}>{item.title}</option>) : ''}
                  </select>
                </div>
                <div className='form-group col-md-6'>
                  <label className='control-label'>Listing title</label>
                  <input maxLength={100} type='text' className='form-control'
                    name='title' value={title} onChange={this.handleChange} placeholder='Enter Listing title' required />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <label className='control-label'>Listing subtitle</label>
                  <input maxLength={100} type='text' className='form-control'
                    name='sub_title' value={sub_title} onChange={this.handleChange} placeholder='Enter Listing subtitle' required />
                </div>
                <div className='form-group col-md-6'>
                  <label className='control-label'>Listing tags</label>
                  <TagsInput value={this.state.tags} onChange={this.handleChangeTags} />
                  <small className='form-text text-muted'>Tags to help your items become more searchable. Seperate
                    your tags with a 'comma'</small>
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <label>Item Description</label>
                  <textarea className='form-control' rows={3}
                    name='description' value={description} onChange={this.handleChange} required />
                </div>
                <div className='form-group col-md-6'>
                  <label className='control-label'>Store</label>
                  <div className='form-control'>{store}</div>
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <small className='form-text text-muted'>Files</small>
                  {imagePreview}
                </div>
              </div>
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='copyrights' />
                <label className='form-check-label' htmlFor='copyrights'>Transfer Copyright when purchased?</label>
              </div>

              {this.props.location.state.relisted ? <Fragment>
                <div className='section-heading'>
                  <h4>Price and type</h4>
                  <nav>
                    <div className='nav nav-tabs'>

                      <a className={fixed ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleFixed}>
                        <img src={TabLogoColor} alt='' className='color img-fluid' />
                        <img src={Tablogo} alt='' className=' active img-fluid' />Fixed</a>

                      <a className={auction ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleAuction}>
                        <img src={TabLogoColor} alt='' className='color img-fluid' />
                        <img src={Tablogo} alt='' className=' active img-fluid' />
                        Auction</a>

                      <a className={auction_with_buy ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleAuctionWithBuy}>
                        <img src={TabLogoColor} alt='' className='color img-fluid' />
                        <img src={Tablogo} alt='' className=' active img-fluid' />Auction with Buy NFT</a>
                    </div>
                  </nav>
                </div>
                <div className='tab-content' >
                  {fixed ? <div className='tab-pane fade show active'>
                    <div className='form-group col-md-6 p-0'>
                      <label className='control-label'>Fixed price - in USD</label>
                      <input maxLength={100} type='number' className='form-control'
                        name='price_usd' value={price_usd} onChange={this.handleChange} min={0.3} step="0.01" placeholder='0.00' required />
                      <small className='form-text text-muted'><span className='color'>Price in {ethSymbol}: {price_eth}</span><br />Current {ethSymbol} price: 1 {ethSymbol} = ${ethereum}</small>
                    </div>
                  </div> : auction ?
                    <div className='tab-pane fade show active'>
                      <div className='form-group col-md-6  p-0'>
                        <label className='control-label'>Starting price - in USD</label>
                        <input maxLength={10} type='number' className='form-control'
                          name='bid_price_usd' value={bid_price_usd} onChange={this.handleChange} placeholder='0.00' min={0.3} step="0.01" required />
                        <small className='form-text text-muted'><span className='color'>Price in {ethSymbol}: {bid_price_eth}</span></small>
                      </div>
                      <div className='form-group col-md-6 p-0'>
                        <label>Auction length</label>
                        <select className='form-control' name='auction_length_id' value={auction_length_id} onChange={this.handleChange} required>
                          <option value='' disabled>Select Auction Length</option>
                          {auctions.length > 1 ? auctions.map(item => <option key={item.id} value={item.id}>{item.title}</option>) : ''}
                        </select>
                      </div>
                    </div> :
                    <div className='tab-pane fade show active' >
                      <div className='form-row'>
                        <div className='form-group col-md-6'>
                          <label className='control-label'>Fixed price - in USD</label>
                          <input maxLength={10} type='number' className='form-control'
                            name='price_usd' value={price_usd} onChange={this.handleChange} min={0.3} step="0.01" placeholder='0.00' required />
                          <small className='form-text text-muted'><span className='color'>Price in {ethSymbol}: {price_eth}</span><br />Current {ethSymbol} price: 1 {ethSymbol} = ${ethereum}</small>
                        </div>
                        <div className='form-group col-md-6'>
                          <label className='control-label'>Starting price - in USD</label>
                          <input maxLength={10} type='number' className='form-control'
                            name='bid_price_usd' value={bid_price_usd} onChange={this.handleChange} min={0.3} step="0.01" placeholder='0.00' required />
                          <small className='form-text text-muted'><span className='color'>Price in {ethSymbol}: {bid_price_eth}</span></small>
                        </div>
                      </div>
                      <div className='form-group col-md-6 p-0'>
                        <label>Auction length</label>
                        <select className='form-control' name='auction_length_id' value={auction_length_id} onChange={this.handleChange} required>
                          <option value='' disabled>Select Auction Length</option>
                          {auctions.length > 1 ? auctions.map(item => <option key={item.id} value={item.id}>{item.title}</option>) : ''}
                        </select>
                      </div>
                    </div>}
                </div>
              </Fragment> : ''}


              {<div className={errors ? 'alert alert-danger ' : ''} role='alert' style={{ color: 'red', fontWeight: 'bold' }}>{errors}</div>}
              <button type="button" onClick={this.handleSubmit} className='btn-default hvr-bounce-in'>
                <span className='icon'>
                  <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                </span>Update Item
                {this.state.smallLoader ? <SmallLoader /> : ''}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(EditItem)