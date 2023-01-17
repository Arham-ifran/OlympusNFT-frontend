import React, { Component } from 'react'
import { UploadUserImage, UpdateProfileApi } from './../../container/Api/api'
import Logo from './../../assets/img/olympusnft-logo.gif'
import Photo from './../../assets/img/profile.jpeg'
import ChangePassword from '../logmodals/ChangePassword'
import { editProfileValidation } from './validation'
import ProfileSideBar from '../profile/ProfileSideBar'
import MyProfile from '../profile/MyProfile'
import { connect } from 'react-redux'
import Loader from './../loader/Loader'
import { fetchUserProfileData } from './../../store/actions/userAction'
import { Message, ErrorHandler } from '../../utils/message'
import SmallLoader from '../loader/SmallLoader'
const $ = window.jQuery
class EditProfile extends Component {

  state = {
    username: '',
    wallet_address: '',
    profileImage: '',
    banner_image: '',
    twitter: '',
    youtube: '',
    instagram: '',
    facebook: '',
    isSubmitted: false,
    errors: '',
    about: 'Lorem Ipsum dolar sit',
    email_notification: false,
    success: false,
    id: localStorage.getItem('id'),
    image: null,
    message: '',
    imagePreviewUrl: '',
    bannerImgUrl: '',
    data: {},
    loading: false
  }

  componentDidMount() {
    $(window).scrollTop('0');
    this.setState({ data: this.props.data })
    if (!this.props.loading) {
      const { username, youtube, twitter, about, instagram, facebook, profile_image, email_notification, wallet_address, banner_img } = this.props.data
      this.setState({
        username,
        wallet_address,
        youtube,
        twitter,
        about,
        instagram,
        facebook,
        email_notification: Boolean(email_notification),
        imagePreviewUrl: profile_image,
        bannerImgUrl: banner_img,
        imageErr: '',
      })
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      return {
        username: nextProps.data.username,
        wallet_address: nextProps.data.wallet_address,
        youtube: nextProps.data.youtube,
        twitter: nextProps.data.twitter,
        about: nextProps.data.about,
        instagram: nextProps.data.instagram,
        facebook: nextProps.data.facebook,
        email_notification: Boolean(nextProps.data.email_notification),
        imagePreviewUrl: nextProps.data.profile_image,
        bannerImgUrl: nextProps.data.banner_img,
      }
    }
    return null
  }

  handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let file = event.target.files[0];
      reader.onloadend = () => {
        this.setState({
          banner_image: file,
          bannerImgUrl: reader.result,
          imageErr: ''
        });
      }
      reader.readAsDataURL(file)

    } else {
      const value = event.target.value;
      const name = event.target.name;
      this.setState({ [name]: value, errors: '', success: false, message: '' })
    }

  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ email_notification: value })
  }

  _handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file.type === 'image/png' || file.type === "image/jpeg") {
      reader.onloadend = () => {
        this.setState({
          image: file,
          imagePreviewUrl: reader.result,
          imageErr: ''
        });
      }
      reader.readAsDataURL(file)
      setTimeout(() => this.handleFileUpload(), 1000)
    } else {
      this.setState({ imageErr: 'Please select png or jpeg image file' })
    }
  }

  handleFileUpload = async () => {
    let body = new FormData();
    body.append("image", this.state.image);
    body.append('user_id', this.state.id)
    let res = await UploadUserImage(body)
    if (res.data.status === 1) {
      this.setState({ imagePreviewUrl: res.data.data.image_path })
      let message = res.data.message;
      Message('success', 'Success', message)
      this.props.dispatch(fetchUserProfileData())
    } else if (res.data.status === 0) {
      let error = res.data.message;
      this.setState({ file: '', imagePreviewUrl: '' })
      Message('error', 'Error', error)
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    let body = new FormData();
    body.append('user_id', this.state.id)
    body.append("username", this.state.username);
    body.append("banner_image", this.state.banner_image);
    body.append('wallet_address', this.state.wallet_address)
    body.append('twitter', this.state.twitter)
    body.append('instagram', this.state.instagram)
    body.append('facebook', this.state.facebook)
    body.append('youtube', this.state.youtube)
    body.append('about', this.state.about)
    body.append('email_notification', Number(this.state.email_notification))
    const { isValid, errors } = editProfileValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      this.setState(state => { return { loading: !state.loading } })
      const res = await UpdateProfileApi(body)
      try {
        if (res.data.status === 1) {
          let message = res.data.message;
          Message('success', 'Success', message)
          this.props.dispatch(fetchUserProfileData())
          this.setState({ loading: false, bannerImgUrl: res.data.data.banner_img })
        } else if (res.data.status === 0) {
          let error = res.data.message;
          this.setState({ loading: false })
          Message('error', 'Error', error)
        }
      }
      catch (error) {
        ErrorHandler(error)
      }
    }
  }

  render() {
    const { imagePreviewUrl, username, wallet_address, twitter, about, instagram, facebook, youtube, email_notification, imageErr, errors, loading, banner_image, bannerImgUrl } = this.state

    let imagePreview = null;
    let bannerImagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img alt='' src={imagePreviewUrl} className='img-fluid' />);
    } else {
      imagePreview = (<img src={Photo} alt='' className='img-fluid' />)
    }
    if (bannerImgUrl) {
      bannerImagePreview = (<img alt='' src={bannerImgUrl} width="100px" height="100px" className='img-fluid' />);
    } else {
      bannerImagePreview = (<img src={Photo} alt='' className='img-fluid' />)
    }
    if (this.props.loading) {
      return <Loader />
    } return (<>
      <ChangePassword />
      <div className="dashboard-wrapper main-padding current-item">
        <div className="row">
          <ProfileSideBar data={this.props.data} />
          <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
              <MyProfile />
              <div className='content-box'>
                <h3>Edit Profile</h3>
                <div className='form-wrapper'>
                  <form >
                    <div className='row'>
                      <div className='col-sm-6'>
                        <div className='form-group'>
                          <label>Display Name</label>
                          <input type='text' className='form-control' id='exampleInputName'
                            name='username' value={username} onChange={this.handleChange} />
                        </div>
                        <div className='form-group'>
                          <label>Wallet Address</label>
                          <input type='text' className='form-control' id='exampleInputaddress'
                            value={wallet_address} readOnly />
                          <small className='form-text text-muted'>To update your address just change your
                            account in your wallet.</small>
                        </div>
                        <div className='form-group'>
                          <label>About</label>
                          <textarea className='form-control' rows={3}
                            name='about' value={about} onChange={this.handleChange} placeholder='Lorem Ipsum dolar sit' />
                        </div>
                        <div className='form-group'>
                          <label className='control-label'>Banner Image <small>(Allowed Types: .jpg, .png)</small></label>
                          <input type='file' accept='.jpg, .jpeg, .png' className='form-control' onChange={this.handleChange}
                            placeholder={banner_image ? banner_image.name : 'Please select image'} />
                          {bannerImagePreview}
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        <div className='change-profile-img'>
                          <div className='profile-img'>
                            {imagePreview}
                          </div>
                          <div className='custom-file'>
                            <input type='file' className='custom-file-input' accept=".jpg, .jpeg, .png" id='customFile' onChange={this._handleImageChange} />
                            <label className='custom-file-label' htmlFor='customFile'>Change Profile Image</label>
                            <small className='image-error'>{imageErr}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h5>Social Media</h5>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='exampleInputtwitter'>Twitter</label>
                        <input type='text' className='form-control' id='exampleInputtwitter' placeholder={twitter ? twitter : 'link to your twitter'}
                          name='twitter' value={twitter} onChange={this.handleChange} />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='exampleInputFacebook'>Facebook</label>
                        <input type='text' className='form-control' id='exampleInputFacebook' placeholder={facebook ? facebook : 'link to your Facebook'}
                          name='facebook' value={facebook} onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='exampleInputInstagram'>Instagram</label>
                        <input type='text' className='form-control' id='exampleInputInstagram' placeholder={instagram ? instagram : 'link to your Instagram'}
                          name='instagram' value={instagram} onChange={this.handleChange} />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='exampleInputyoutube'>Youtube</label>
                        <input type='text' className='form-control' id='exampleInputyoutube' placeholder={youtube ? youtube : 'link to your Youtube'}
                          name='youtube' value={youtube} onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input'
                        name='email_notification' checked={email_notification} value={email_notification} onChange={this.handleInputChange} />
                      <label className='form-check-label' htmlFor='exampleCheck1'><b>Disable email
                        notifications.</b> (You won't recieve ANY emails from OlympusNFT if you do
                        this - including important ones related to your account security or
                        purchases)</label>
                    </div>

                    {<div className={errors ? "alert alert-danger " : ''} role="alert" style={{ color: 'red', fontWeight: "bold" }}>{errors}</div>}
                    <div className='button-group'>
                      <span data-toggle='modal' data-target='.changePassword-modal-lg' className='btn btn-secondary'>Change your password</span>
                      {!loading ? <button className='btn-default hvr-bounce-in' onClick={this.handleSubmit}><span className='icon'>
                        <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                      </span>Save Changes</button> :
                        <div className='form-group'>
                          <div className='col-lg-6'>
                            <SmallLoader />
                          </div>
                        </div>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
}


const mapStateToProps = state => {
  return {
    data: state.userReducer.userData,
    loading: state.userReducer.loading
  }
}
const mapDispatchToProps = dispatch => {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)