import React, { Component } from 'react'
import { loginValidation } from './Validation'
import { LoginApi } from './../../container/Api/api';
import { userUpdateToken } from '../../store/actions/userAction'
import { connect } from 'react-redux'
import { Message } from '../../utils/message';
import SmallLoader from '../loader/SmallLoader';

const $ = window.jQuery
class Signin extends Component {

  state = {
    email: '',
    password: '',
    isSubmitted: false,
    errors: '',
    loading: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: ''
    })
  }
  validateForm = () => {
    var form = document.getElementsByClassName('needs-validation')[0];
    let isValid = true;
    if (form.checkValidity() === false) {
      isValid = false;
      form.classList.add('was-validated');
    }
    return isValid;
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = this.validateForm();
    if (isValid) {
      this.setState({ isSubmitted: true, errors: undefined });
      const { isValid, errors } = loginValidation(this.state);
      if (!isValid) {
        this.setState({ errors, isSubmitted: false });
        return false;
      } else {
        this.setState(state => { return { loading: !state.loading } })
        let body = { email: this.state.email, password: this.state.password }
        let res = await LoginApi(body)
        try {
          if (res.data.status === 1) {
            this.props.dispatch(userUpdateToken(res.data.token, res.data.data.user_id))
            const message = res.data.message;
            this.setState({ message, error: '', loading: false })
            Message('success', 'Success', message)
            $('#myLargeModalLabel').hide();
            $('body').removeClass('modal-open');
            $('body').css('padding-right', '0px');
            $('.modal-backdrop').remove();
          } else if (res.data.status === 0) {
            const Error = res.data.message;
            Message('error', 'Error', Error)
            this.setState({ errors: Error ? Error : 'Invalid Email / Password ', loading: false })
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
  render() {
    const { OlympusNFTLogo, Logo } = this.props
    const { email, password, errors, loading } = this.state
    return (
      <div className='tab-pane fade show active' id='v-pills-login' role='tabpanel' aria-labelledby='v-pills-login-tab'>
        <div className='form-wrapper'>
          <div className='logo'>
            <img src={OlympusNFTLogo} alt='' className='img-fluid' />
          </div>
          <h4>Login</h4>
          <form className="needs-validation" noValidate>
            <div className='form-group'>
              <label className='control-label'>Email address</label>
              <input maxLength={100} type='text' className='form-control' placeholder='Enter email'
                name='email' value={email} onChange={this.handleChange} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    this.handleSubmit(e)
                  }
                }} required />
              <div className="invalid-feedback">
                email is required.
              </div>
            </div>
            <div className='form-group'>
              <label>Password</label>
              <input type='password' className='form-control' placeholder='Password'
                name='password' value={password} onChange={this.handleChange} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    this.handleSubmit(e)
                  }
                }} required />
              <div className="invalid-feedback">
                password is required.
              </div>
            </div>
            <a className='forget' id='v-pills-forget-tab' data-toggle='pill' href='#v-pills-forget' role='tab' aria-controls='v-pills-forget' aria-selected='false'>Forget my password</a>
            <br />
            <div className={errors ? 'alert alert-danger m-auto' : ''} role='alert' style={{ color: 'red', fontWeight: 'bold' }}>{errors}</div>
            {!loading ? <button type='button' onClick={this.handleSubmit} className='btn-default hvr-bounce-in'>
              <span className='icon'>
                <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
              </span> Log In
            </button> : <SmallLoader />}

          </form>
        </div>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}
export default connect(mapDispatchToProps)(Signin)