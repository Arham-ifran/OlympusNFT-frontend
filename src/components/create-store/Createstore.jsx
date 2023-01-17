import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import TagsInput from 'react-tagsinput'
import { createStoreValidation } from './validation'
import { FetchStoreApi, CreateStoreApi } from './../../container/Api/api'
import Loader from '../loader/Loader'
import Logo from './../../assets/img/olympusnft-logo.gif'
import { ErrorHandler, Message, messageFormater } from './../../utils/message';
import { supportedImgs, supportedVideos } from './../../constant/constant';
const $ = window.jQuery;
class Createstore extends Component {

  state = {
    categories: [],
    category_id: '',
    store_title: '',
    sub_title: '',
    tags: [],
    image: '',
    description: '',
    store_your_data: '',
    royalty_amount: 0,
    isSubmitted: false,
    errors: '',
    create: true,
    preview: false,
    loading: true,
    redirect: false,
    user_id: localStorage.getItem('id'),
    imagePreviewUrl: '',
    imageErr: '',
    tagsErrorMessage: ''
  }

  async componentDidMount() {
    $(window).scrollTop('0');
    let res = await FetchStoreApi()
    try {
      if (res.data.status === 1) {
        let categories = res.data.data.categories
        this.setState({ categories, loading: false })
      } else if (res.data.status === 0) {
        this.setState({ categories: [], loading: false })
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  handleChangeTags = (tags) => {
    this.setState({ tags, tagsErrorMessage: '' })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errors: '' })
  }

  handleFileInput = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (supportedImgs.indexOf(file.type) !== -1 || supportedVideos.indexOf(file.type) !== -1) {
      reader.onloadend = () => {
        this.setState({
          image: file,
          imagePreviewUrl: reader.result,
          imageErr: ''
        });
      }
      reader.readAsDataURL(file)
    } else {
      this.setState({
        image: '',
        imagePreviewUrl: '',
        imageErr: 'Please select image or video file only.'
      });
    }
  }

  handleNext = async (e) => {
    e.preventDefault();
    let isStoreFormValid = this.validateForm();
    if (isStoreFormValid) {
      this.setState({ isSubmitted: true, errors: undefined });
      const { isValid, errors } = createStoreValidation(this.state);
      if (!isValid) {
        this.setState({ errors, isSubmitted: false });
        return false;
      } else {
        this.setState(state => {
          return {
            preview: !state.preview
          }
        })
      }
    }

  }
  handleEdit = () => {
    this.setState(() => {
      return { preview: false }
    })
  }
  validateForm = () => {
    var form = document.getElementsByClassName('needs-validation-store')[0];
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
  handleSubmit = async (e) => {
    this.setState(state => { return { loading: !state.loading } })
    e.preventDefault()

    let body = new FormData();
    body.append('category_id', this.state.category_id);
    body.append('store_title', this.state.store_title);
    body.append('sub_title', this.state.sub_title);
    body.append('store_tags', this.state.tags);
    body.append('description', this.state.description);
    body.append('store_your_data', 1);
    body.append('royalty_amount', this.state.royalty_amount);
    body.append('image', this.state.image);
    body.append('user_id', this.state.user_id);

    let res = await CreateStoreApi(body);
    try {
      if (res.data.status === 1) {
        let message = res.data.message;
        this.setState({ redirect: true, loading: false })
        Message('success', 'Success', message)
      } else if (res.data.status === 0) {
        let message = '';
        if (typeof res.data.message === 'string') {
          message = res.data.message
        } else if (typeof res.data.message === 'object') {
          message = res.data.message
        }
        let errorMessage = messageFormater(message)
        if (errorMessage) {
          Message('error', 'Sorry', errorMessage)
        }
        this.setState({ loading: false, redirect: false, errors: errorMessage })
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  handlePasteSplit(data) {
    const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  }

  render() {
    const { imagePreviewUrl, imageErr, categories, category_id, store_title, sub_title,
      image, tags, description, create, preview, errors, loading, redirect, tagsErrorMessage } = this.state

    let imagePreview = null;
    if (image !== undefined && imagePreviewUrl) {
      imagePreview = (<img alt='Image' style={{ height: '120px', width: '90px' }} src={imagePreviewUrl} className='img-fluid' />);
    } else {
      imagePreview = null
    }

    if (loading) {
      return <Loader />
    } else if (redirect) {
      return <Redirect to='/profile' />
    } return (
      <div className='main-wrapper main-padding create-store'>
        <div className='breadcrumb'>
          <div className='breadcrumb-item'><Link to='/'>Home</Link></div>
          <div className='breadcrumb-item active' aria-current='page'><Link to='/create-store'>Create Store</Link></div>
        </div>
        <div className='container'>
          <div className='page-title'>
            <h2>Create a store</h2>
            <p>To start selling your items, you need a store to put these items. so create a store and add your
              items to list for sale</p>
          </div>
          <div className='stepwizard'>
            <div className='stepwizard-row setup-panel'>
              <div className='stepwizard-step col-xs-3'>
                {create ? <a type='button' className='btn btn-success btn-circle'>1</a> :
                  <a type='button' className='btn btn-circle'>1</a>}
                <p><small>Create </small></p>
              </div>
              <div className='stepwizard-step col-xs-3'>
                {preview ? <a type='button' className='btn btn-success btn-circle'>2</a> :
                  <a type='button' className='btn btn-circle'>2</a>}
                <p><small>Preview</small></p>
              </div>
            </div>
          </div>
          <div className='content-box'>
            <form className="needs-validation-store" onSubmit={this.handleSubmit} noValidate>
              {!preview ?
                <div className='panel panel-primary setup-content' style={create ? { display: 'block' } : { display: 'none' }}>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>Basic Information
                    </h3>
                  </div>
                  <div className='panel-body'>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label>What kind of item are you making?</label>
                        <select className='form-control' name='category_id' value={category_id} onChange={this.handleChange} required>
                          <option value='' disabled>Select Category</option>
                          {categories.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                        </select>
                        <div className="invalid-feedback">
                          Please select a category.
                        </div>
                      </div>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Title</label>
                        <input maxLength={100} type='text' className='form-control' placeholder='Enter Store title'
                          name='store_title' value={store_title} onChange={this.handleChange} required />
                        <div className="invalid-feedback">
                          Store Title is required.
                        </div>
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>

                        <label className='control-label'>Store Sub Title</label>
                        <input maxLength={100} type='text' className='form-control' placeholder='Enter Store sub-title'
                          name='sub_title' value={sub_title} onChange={this.handleChange} required />
                        <div className="invalid-feedback">
                          Sub Title is required.
                        </div>
                      </div>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Tags</label>
                        <TagsInput
                          value={tags}
                          addOnPaste={true}
                          pasteSplit={this.handlePasteSplit}
                          onlyUnique={true}
                          addKeys={[188, 9, 13]}
                          // addTag
                          className={tagsErrorMessage ? 'react-tagsinput-error' : 'react-tagsinput'}
                          onChange={this.handleChangeTags} required />
                        <small className='form-text text-muted'>Tags to help your items become more searchable.
                          Seperate your tags with 'comma', or 'Press enter'</small>
                        {tagsErrorMessage != '' ? <small className='form-text text-danger'>{tagsErrorMessage}</small> : ""}
                        <div className="invalid-feedback">
                          {errors}
                        </div>
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Image</label>
                        <input type='file' accept='image/*' className='form-control' onChange={this.handleFileInput} required />
                        <div className="invalid-feedback">
                          Image is required.
                        </div>
                        {imageErr ? <small className='form-text text-muted'>{imageErr}</small> : <small className='form-text text-muted'>Upload preview image for your store</small>}
                        {imagePreview}
                      </div>
                      <div className='form-group col-md-6'>
                        <label >Store Description</label>
                        <textarea className='form-control' id='description' rows={3}
                          name='description' value={description} onChange={this.handleChange} required />
                      </div>
                    </div>
                  </div>
                  <button className='btn-default hvr-bounce-in' type='button' onClick={this.handleNext}><span className='icon'>
                    <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                  </span>Next</button>
                </div>
                : <div className='panel panel-primary setup-content' style={preview ? { display: 'block' } : { display: 'none' }}>
                  <div className='panel-heading'>
                    <h3 className='panel-title'>Information Preview</h3>
                  </div>
                  <div className='panel-body'>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='exampleFormControlSelect1'>What kind of item are you making?</label>
                        <select className='form-control' id='exampleFormControlSelect1' name='category_id' value={category_id} onChange={this.handleChange}>
                          <option>Music</option>
                          <option>Art</option>
                          <option>Film</option>
                        </select>
                      </div>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Title</label>
                        <input maxLength={100} type='text' className='form-control' placeholder='Enter Store title'
                          name='store_title' value={store_title} disabled />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Sub Title</label>
                        <input maxLength={100} type='text' className='form-control' placeholder='Enter Store sub-title'
                          name='sub_title' value={sub_title} disabled />
                      </div>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Tags</label>
                        <TagsInput value={tags} disabled />
                        <small className='form-text text-muted'>Tags to help your items become more searchable.
                          Seperate your tags with a 'comma'</small>
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label className='control-label'>Store Image</label>
                        <input type='file' accept='.jpg, .jpeg, .png' className='form-control' placeholder={image ? image.name : 'No file selected'} disabled />
                        <small className='form-text text-muted'>Upload preview image for your store</small>
                        {imagePreview}
                      </div>
                      <div className='form-group col-md-6'>
                        <label >Store Description</label>
                        <textarea className='form-control' id='description' rows={3}
                          name='description' value={description} disabled />
                      </div>
                    </div>

                  </div>
                  <div className='row'>
                    <div className='btns-wrapper'>
                      <button onClick={this.handleEdit} className='btn-default hvr-bounce-in' type='button'>
                        <span className='icon'>
                          <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                        </span>Edit</button>
                      <button className='btn-default hvr-bounce-in'><span className='icon'>
                        <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' type='submit' />
                      </span>Proceed</button>
                    </div>
                  </div>
                </div>}

            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Createstore);