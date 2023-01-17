import React, { Component } from 'react'
import { CreateItemApi, AuctionLengthAndCategoriesApi, EthereumPriceApi, UserStoreListCreateItemApi } from './../../container/Api/api'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { createItemValidation } from './validation'
import Loader from '../loader/Loader'
import Logo from './../../assets/img/olympusnft-logo.gif'
import TabLogoColor from './../../assets/img/tab-logo-color.png'
import Tablogo from './../../assets/img/tab-logo.png'
import TagsInput from 'react-tagsinput';
import { Message, ErrorHandler } from './../../utils/message';
import { UploadMediaOnIpfs, UploadMediaArrayOnIpfs } from "../../utils/ipfs";
import { readContractByName } from "../../utils/contracts";
import { etheriumProvider, networkName, currentPrice, ethSymbol } from "../../constant/constant";
import { connect } from 'react-redux'
import Web3 from 'web3'
import SmallLoader from '../loader/SmallLoader'
import { Slider } from 'antd';
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'

var Buffer = require('buffer/').Buffer
let transactionFee = ""
const $ = window.jQuery
class Createitem extends Component {

  state = {
    user_id: localStorage.getItem('id'),
    category_id: '',
    title: '',
    sub_title: '',
    description: '',
    royalty_percentage: 0,
    ipfsImageHash: '',
    imagePreviewUrl: '',
    imageErr: '',
    private_files: [],
    privateImagePreviewUrl: '',
    privateImageErr: '',
    is_private_files: false,
    price_type: 0,
    price_usd: '',
    price_eth: 0,
    bid_price_usd: '',
    bid_price_eth: 0,
    auction_length_id: '',
    categories: [],
    auctions: [],
    tags: [],
    fixed: true,
    auction: false,
    auction_with_buy: false,
    ethereum: '',
    loading: true,
    isSubmitted: false,
    errors: '',
    success: false,
    buffer: "",
    fileTypes: '',
    filesName: '',
    public_files: [],
    categoryName: '',
    accounts: '',
    userStores: [],
    store_id: "",
    smallLoader: false,
    transactionHash: "",
    originalCreator: "",
    data: "",
    tagsErrorMessage: "",
    quantity: 1
  }

  async componentDidMount() {
    $(window).scrollTop('0');
    const web3 = new Web3(etheriumProvider)
    if (window.ethereum && window.ethereum !== 'undefined') {
      await window.ethereum.enable();
    }
    const accounts = await web3.eth.getAccounts();
    let stores = await UserStoreListCreateItemApi();
    try {
      if (stores.data.status === 1) {
        let data = stores.data.data;
        this.setState({ userStores: data })
      } else if (stores.data.status === 0) {
        this.setState({ userStores: [] })
      }
    } catch (err) {
      ErrorHandler(err)
    }
    this.setState({ accounts })
    let res = await AuctionLengthAndCategoriesApi()
    try {
      if (res.data.status === 1) {
        this.setState({
          categories: res.data.data.categories,
          auctions: res.data.data.auction_length,
          loading: false
        })
      } else if (res.data.status === 0) {
        this.setState({
          categories: [],
          auctions: [],
          loading: false
        })
      }
    } catch (err) {
      ErrorHandler(err)
    }
    this.calculateEthereumPrice()
  }

  calculateEthereumPrice = async () => {
    let res = await EthereumPriceApi()
    if (res.status === 200) {
      let ethereum = res.data[currentPrice].usd
      this.setState({ ethereum })
      if (this.state.price_usd > 0 || this.state.bid_price_usd > 0) {
        let price_eth = this.state.price_usd / ethereum;
        let bid_price_eth = this.state.bid_price_usd / ethereum;
        this.setState({ price_eth, bid_price_eth })
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errors: '' })
    if (e.target.name === 'price_usd' || 'bid_price_usd') {
      this.calculateEthereumPrice()
    } else if (e.target.name === 'bid_price_usd') {
      this.calculateEthereumPrice()
    } if (e.target.name === 'is_private_files') {
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      this.setState({ is_private_files: value })
    } if (e.target.name === 'category_id') {
      let Name = this.state.categories.filter((item) => item.id === Number(e.target.value))
      this.setState({ categoryName: Name[0].title })
    } if (e.target.name === 'quantity') {
      this.setState({ quantity: e.target.value })
    }
  }

  handleFileInput = async (e) => {
    e.preventDefault()
    let files = e.target.files
    let public_files = await this.readFilesAsBuffer(files);
    this.setState({ files, public_files })
  }
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
  handlePrivateFileInput = async (e) => {
    e.preventDefault()
    let files = e.target.files
    let private_files = await this.readFilesAsBuffer(files);
    this.setState({ private_files, private_files })
  }

  handleChangeTags = (tags) => {
    this.setState({ tags })
  }

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

  addDays = (days) => {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result.getTime();
  }

  readContract = async (jsonHash) => {
    var $this = this;
    const web3 = new Web3(etheriumProvider)
    try {
      let { instance } = readContractByName("OlympusNFTMintableToken", networkName);
      let accounts = await web3.eth.getAccounts()
      let accountId = accounts[0];
      const msgParams = JSON.stringify({
        domain: {
          chainId: window.ethereum.networkVersion,
          name: 'OlympusNFT',
          verifyingContract: instance._address,
          version: '1',
        },
        message: {
          seller: accountId,
          expiryTime: this.addDays(365),
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
            return Message('error', 'Error', "Transaction Denied")
          }
          if (result) {
            return $this.handleSubmitFormValues(accountId, result.result, jsonHash, instance._address)
          }
        }
      );

      this.setState({ smallLoader: false })
      return { accountId }
    } catch (error) {
      this.props.push('/create-item')
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
        let mediaHash = await UploadMediaArrayOnIpfs(this.state.public_files);
        let ImageHash = mediaHash[0].hash
        let privateMediaHash = await UploadMediaArrayOnIpfs(this.state.private_files);
        var json = {
          "symbol": `${this.props.site_name}`,
          "image": `https://ipfs.io/ipfs/${ImageHash}`,
          "animation_url": "",
          "copyright_transfer": false,
          "address": `${this.state.accounts}`,
          "tokenId": "",
          "resellable": true,
          "original_creator": `${this.state.accounts[0]}`,
          "edition_number": 1,
          "description": `${this.state.description}`,
          "auctionLength": `${this.state.auction_length_id}`,
          "title": `${this.state.title}`,
          "type": `${this.state.fileTypes}`,
          "url": "",
          "file_key": `000000-0000000000/1126218531989441363686330267636783094540372611621491432812148158871706666496/${this.state.filesName}`,
          "apiURL": "",
          "subtitle": `${this.state.sub_title}`,
          "name": `${this.state.filesName}`,
          "preview_images": mediaHash,
          "auctionType": `${this.state.price_type === 0 ? 'Fixed' : this.state.price_type === 1 ? 'Auction' : 'Auction and Buy'}`,
          "category": `${this.state.categoryName}`,
          "edition_total": 1,
          "gasless": true
        };
        var jsonse = JSON.stringify(json);
        // var blob = new Blob([jsonse], { type: "application/json" });
        let jsonHash = await UploadMediaOnIpfs(jsonse);
        let tokenId = 0;
        this.setState({ isSubmitted: true, errors: undefined, ipfsImageHash: jsonHash.path });
        const { isValid, errors } = createItemValidation(this.state);
        if (!isValid || (tokenId === undefined)) {
          this.setState({ errors, isSubmitted: false, smallLoader: false });
          return false;
        } else {
          await this.readContract(jsonHash.path);
        }
      } catch (error) {
        this.setState({ errors: error.message, isSubmitted: false, smallLoader: false });
        return false;
      }
    }
  }

  handleSubmitFormValues = async (accountId, transactionHash, jsonHash, contract) => {

    let { user_id, category_id, title, sub_title, description, ipfsImageHash, private_files, price_type,
      price_usd, bid_price_usd, auction_length_id, is_private_files, public_files, store_id, tags, royalty_percentage, quantity } = this.state;
    let tokenId = [];
    if (quantity > 0) {
      for (var i = 0; i < quantity; i++) {
        tokenId.push(this.uuid().substring(0, 64));
      }
    }

    let body = new FormData();
    body.append('user_id', user_id)
    body.append('category_id', category_id);
    body.append('title', title);
    body.append('sub_title', sub_title);
    body.append('store_id', store_id ? store_id : '0Ne6p86ypV');
    body.append('description', description);
    body.append('listing_tag', tags);
    body.append('bid_price_usd', bid_price_usd);
    body.append('auction_length_id', auction_length_id);
    body.append('public_files', JSON.stringify(public_files));
    body.append('price_type', price_type)
    body.append('is_private_files', Number(is_private_files));
    body.append('quantity', Number(quantity));
    body.append('private_files', JSON.stringify(private_files))
    body.append('price_usd', price_usd)
    body.append('token_id', JSON.stringify(tokenId));
    body.append('original_creator', accountId);
    body.append('transaction_hash', transactionHash);
    body.append('royalty_percentage', royalty_percentage)
    body.append('token_metadata', jsonHash)
    body.append('contract', jsonHash)
    const res = await CreateItemApi(body)
    try {
      if (res.data.status === 1) {
        let message = res.data.message;
        this.setState({ smallLoader: false, errors: '', success: true })
        Message('success', 'Success', message)
      } else if (res.data.status === 0) {
        this.setState(() => { return { smallLoader: false } })
        let error = res.data.message;
        Message('error', 'Sorry', error)
      }
    } catch (err) {
      if (err) {
        this.setState({ smallLoader: false })
        ErrorHandler(err)
      }
    }
  }

  validateForm = () => {
    var form = document.getElementsByClassName('needs-validation-create-item')[0];
    let isValid;
    if (this.state.tags.length > 0) {
      isValid = true
    } else {
      this.setState({ tagsErrorMessage: 'Please, provide atleast one tag' })
      isValid = false
    }
    if (form.checkValidity() === false) {
      isValid = false;
      form.classList.add('was-validated');
    }
    return isValid;
  }

  handlePasteSplit(data) {
    const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  }

  handleRoyalty = (value) => {
    this.setState({ royalty_percentage: value })
  }
  formatter(value) {
    return `${value}%`;
  }

  render() {

    const {
      success, category_id, title, sub_title, description, imagePreviewUrl, privateImagePreviewUrl,
      price_usd, price_eth, bid_price_usd, bid_price_eth, ethereum, files, private_files, is_private_files, quantity,
      categories, auction_length_id, auctions, fixed, auction, auction_with_buy, errors, store_id, tagsErrorMessage } = this.state

    let imagePreview = null;
    if (files !== undefined && imagePreviewUrl) {
      imagePreview = (<img alt='' style={{ height: '120px', width: '90px' }} src={imagePreviewUrl} className='img-fluid' />);
    } else {
      imagePreview = null
    }

    let privateImagePreview = null;
    if (private_files !== undefined && privateImagePreviewUrl) {
      privateImagePreview = (<img alt='' style={{ height: '120px', width: '90px' }} src={privateImagePreviewUrl} className='img-fluid' />);
    } else {
      privateImagePreview = null
    }

    if (this.state.loading && !success) {
      return <Loader />
    } else if (success) {
      return <Redirect to='/current-item-list' />
    } return (
      <div className='main-wrapper main-padding create-store'>
        <div className='breadcrumb'>
          <div className='breadcrumb-item'><Link to='/'>Home</Link></div>
          <div className='breadcrumb-item active' aria-current='page'>Sell</div>
        </div>
        <div className='container'>
          <div className='page-title'>
            <h2>Create and List an item for sale</h2>
          </div>
          <div className='content-box'>
            <form className="needs-validation-create-item" onSubmit={this.handleSubmit} noValidate>
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
                  <TagsInput value={this.state.tags}
                    addOnPaste={true}
                    pasteSplit={this.handlePasteSplit}
                    onlyUnique={true}
                    addKeys={[188, 9, 13]}
                    className={tagsErrorMessage ? 'react-tagsinput-error' : 'react-tagsinput'}
                    onChange={this.handleChangeTags} />
                  <small className='form-text text-muted'>Tags to help your items become more searchable. Seperate your tags with 'comma' or 'press enter'</small>
                  {tagsErrorMessage != '' ? <small className='form-text text-danger'>{tagsErrorMessage}</small> : ""}
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <label>Item Description</label>
                  <textarea className='form-control' rows={3}
                    name='description' value={description} onChange={this.handleChange} required />
                </div>
                <div className='form-group col-md-6'>
                  <label>Store</label>
                  {this.state.userStores.length > 1 ?
                    <select className='form-control' name='store_id' value={store_id} onChange={this.handleChange} required>
                      <option value='' disabled>Select Store</option>
                      {this.state.userStores.length > 1 ? this.state.userStores.map(item => <option key={item.id} value={item.id}>{item.store_title}</option>) : 'OlympusNFT Store'}
                    </select>
                    :
                    <select className='form-control' >
                      <option value="0Ne6p86ypV">OlympusNFT Store</option>
                    </select>
                  }
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-md-6'>
                  <label>Royalties %</label>
                  <Slider
                    max={50}
                    tipFormatter={this.formatter}
                    onChange={this.handleRoyalty} />
                  <p>Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</p>
                </div>
              </div>
              <div className="form-row">
                <div className='form-group col-md-6'>
                  <label className='control-label'>Add Files <small>(Allowed Types: images / Videos)</small></label>
                  <input type='file' accept='image/*,video/*' className='form-control' onChange={this.handleFileInput}
                    placeholder={files ? files.name : 'Please select image'} multiple required />
                  <small className='form-text text-muted'>Files must be Images or videos only</small>
                  {imagePreview}
                </div>
              </div>
              <div className='form-check'>
                <label className='form-check-label' ><input type='checkbox' className='form-check-input'
                  name='is_private_files' value={is_private_files} onChange={this.handleChange} />
                  Attach a private file/unlockable content?</label>
              </div>
              {is_private_files ? <div className='form-group col-md-6 p-0'>
                <label className='control-label'>Upload a private/unlockable item file. </label>
                <input type='file' accept='image/*,video/*' className='form-control' onChange={this.handlePrivateFileInput}
                  placeholder={private_files ? private_files.name : 'Please select files which are mentioned below'} multiple />
                <small className='form-text text-muted'>(items may be audio, video, image, files, ZIP, documents and many more)</small>
                {privateImagePreview}
              </div> : ''}
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='copyrights' />
                <label className='form-check-label' htmlFor='copyrights'>Transfer Copyright when purchased?</label>
              </div>
              <div className='section-heading'>
                <h4>Price and type</h4>
                <nav>
                  <div className='nav nav-tabs'>

                    <a className={fixed ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleFixed}>Fixed</a>

                    <a className={auction ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleAuction}>Auction</a>

                    <a className={auction_with_buy ? 'nav-item nav-link active' : 'nav-item nav-link'} onClick={this.handleAuctionWithBuy}>Auction with Buy NFT</a>
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

              <div className='form-group col-md-6 p-0'>
                <label className='control-label'>Supply</label>
                <input max={1000} type='number' className='form-control'
                  name='quantity' value={quantity} onChange={this.handleChange} min="1" placeholder='1' required />
                <small className='form-text text-muted'><span className='color'>The number of copies that can be minted. No gas cost to you!</span></small>
              </div>

              {<div className={errors ? 'alert alert-danger ' : ''} role='alert' style={{ color: 'red', fontWeight: 'bold' }}>{errors}</div>}
              <button type="button" onClick={this.handleSubmit} disabled={this.state.smallLoader} className='btn-default hvr-bounce-in' style={this.state.loading ? { display: 'none' } : { display: 'block' }}>
                List This Item
                {this.state.smallLoader ? <SmallLoader /> : ''}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    site_name: state.siteSettingReducer.site_name,
  }
}
export default connect(mapStateToProps)(withRouter(Createitem));