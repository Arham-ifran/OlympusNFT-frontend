import React, { Component } from 'react'
import { signupValidation } from './Validation'
import { SignupApi } from './../../container/Api/api'
import { userUpdateToken } from '../../store/actions/userAction'
import { connect } from 'react-redux'
import { Message } from '../../utils/message';
import SmallLoader from '../loader/SmallLoader'

const $ = window.jQuery
class Signup extends Component {
  state = {
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    accept: false,
    email_notification: false,
    user_type: '',
    isSubmitted: false,
    errors: undefined,
    message: '',
    loading: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps) {
      if (nextProps.userType > 0) {
        return {
          user_type: nextProps.userType,
          email_notification: true
        }
      }
    }
    return null;
  }

  handleChange = (e) => {
    
    this.setState({
      [e.target.name]: e.target.value,
      errors: ''
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    let isValid = this.validateForm();
    if (isValid) {
      this.setState({ isSubmitted: true, errors: undefined });
      const { isValid, errors } = signupValidation(this.state);
      if (!isValid) {
        this.setState({ errors, isSubmitted: false });
        return false;
      } else {
        this.setState(state => { return { loading: !state.loading } })
        let body = {
          username: this.state.username, email: this.state.email, password: this.state.password,
          accept: this.state.accept, email_notification: this.state.email_notification, user_type: Number(this.state.user_type)
        }
        const res = await SignupApi(body)
        try {
          if (res.data.status === 0) {
            const errors = res.data.message.email && res.data.message.email[0] ? res.data.message.email[0] : res.data.message.username && res.data.message.username[0] ? res.data.message.username[0] : res.data.message.password && res.data.message.password[0] ? res.data.message.password[0] : 'Invalid record'
            this.setState({ errors, loading: false })
            Message('error', 'Error', errors)
          } else if (res.data.status === 1) {
            this.props.dispatch(userUpdateToken(res.data.token, res.data.data.user_id))
            const message = res.data.message;
            Message('success', 'Success', message)
            this.setState({ error: '', loading: false })
            $('#myLargeModalLabel').hide();
            $('body').removeClass('modal-open');
            $('body').css('padding-right', '0px');
            $('.modal-backdrop').remove();
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

  }
  validateForm = () => {
    var form = document.getElementsByClassName('needs-validation-sign-up')[0];
    let isValid = true;
    if (form.checkValidity() === false) {
      isValid = false;
      form.classList.add('was-validated');
    }
    return isValid;
  }
  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { username, email, confirmEmail, password, user_type, accept, email_notification, errors } = this.state
    const { Logo, OlympusNFTLogo } = this.props
    return (
      <div className='tab-pane fade' id='v-pills-signup' role='tabpanel'>
        <div className='form-wrapper'>
          <div className='logo'>
            <img src={OlympusNFTLogo} alt='' className='img-fluid' />
          </div>
          <h4>Create an Account</h4>
          <form className="needs-validation-sign-up" onSubmit={this.handleSubmit} >
            <div className='form-group' >
              <label htmlFor='exampleInputuser'>Username </label>
              <input type='text' className='form-control'
                minLength={6}
                maxLength={20}
                placeholder='Enter Username'
                name='username'
                value={username}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='exampleInputEmail1'>Email </label>
              <input type='email' className='form-control' placeholder='Enter email'
                name='email'
                value={email}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='exampleInputEmail1'>Confirm Email</label>
              <input type='email' className='form-control' placeholder='Enter email'
                name='confirmEmail'
                value={confirmEmail}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='exampleInputPassword1'>Password</label>
              <input type='password' className='form-control' placeholder='Password'
                name='password'
                value={password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='exampleInputPassword1'>User Type</label>
              <select className='form-control' name='user_type' value={user_type} onChange={this.handleChange} required>
                <option value='' disabled>Select User Type</option>
                <option value={1}>Investors</option>
                <option value={2}>Artist</option>
                <option value={3}>Musician	</option>
              </select>
            </div>


            <div className='form-check'>
              <input type='checkbox' className='form-check-input' id='exampleCheck1' name='accept' value={accept} onChange={this.handleInputChange} required />
              <label className='form-check-label' htmlFor='exampleCheck1'>Creating an
                account means you accept our <a >Terms of
                  Service</a> and <a >Privacy Policy</a></label>
            </div>
            <div className='form-check'>
              <input type='checkbox' className='form-check-input' id='email_notification' name='email_notification'
                value={email_notification} onChange={this.handleInputChange} defaultChecked={email_notification} />
              <label className='form-check-label' htmlFor='email_notification'>Don't send me any emails, including when my NFTs sell or when I buy some</label>
            </div>

            <div className={errors ? "alert alert-danger m-auto" : ''} role="alert" style={{ color: 'red', fontWeight: "bold" }}>{errors}</div>
            {!this.state.loading ? <button type='button' onClick={this.handleSubmit} className='btn-default hvr-bounce-in'><span className='icon'>
              <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
            </span> Create Account</button> : <SmallLoader />}
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
const mapStateToProps = state => {
  return {
    userType: Number(state.userReducer.userType)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)