import React, { Component } from 'react'
import { forgetValidation } from './Validation'
import { ForgetPasswordApi } from './../../container/Api/api'
import { Message, ErrorHandler } from '../../utils/message';
import SmallLoader from '../loader/SmallLoader';

const $ = window.jQuery
class ForgetPassword extends Component {
  state = {
    email: '',
    errors: '',
    isSubmitted: false,
    loading: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = forgetValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      this.setState(state => { return { loading: !state.loading } })
      let body = { email: this.state.email }
      let res = await ForgetPasswordApi(body)
      try {
        if (res.data.status === 0) {
          this.setState({ errors: res.data.message, loading: false })
        } else if (res.data.status === 1) {
          this.setState({ loading: false })
          const message = res.data.message;
          Message('success', 'Success', message)
          $('#myLargeModalLabel').hide();
          $('body').removeClass('modal-open');
          $('body').css('padding-right', '0px');
          $('.modal-backdrop').remove();
        }
      } catch (err) {
        ErrorHandler(err)
      }
    }
  }

  render() {
    const { OlympusNFTLogo, Logo } = this.props
    const { email, errors, loading } = this.state
    return (
      <div className="tab-pane fade" id="v-pills-forget" role="tabpanel" aria-labelledby="v-pills-forget-tab">
        <div className="form-wrapper">
          <div className="logo">
            <img src={OlympusNFTLogo} alt="" className="img-fluid" />
          </div>
          <h4>Enter your email to continue</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email </label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                name="email" value={email} onChange={this.handleChange} placeholder="Enter email" />
            </div>
            <br />
            <span className="m-auto" style={{ color: 'red', fontWeight: "bold" }}>{errors}</span>
            {!loading ? <button type="submit" className="btn-default hvr-bounce-in">Forget Password</button> : <SmallLoader />}
          </form>
        </div>
      </div>
    )
  }
}
export default ForgetPassword;