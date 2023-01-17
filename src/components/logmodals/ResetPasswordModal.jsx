import React, { Component } from 'react'
import BannerImage from './../../assets/img/banner-2.png'
import OlympusNFTLogo from './../../assets/img/art-nft-logo.png'
import { resetPasswordValidation } from './Validation'
import { Message, ErrorHandler } from './../../utils/message'
import { ResetPasswordApi } from './../../container/Api/api'
import SmallLoader from '../loader/SmallLoader'
let $ = window.jQuery
export default class ResetPasswordModal extends Component {

  state = {
    newPassword: '',
    confirmPassword: '',
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
    const { isValid, errors } = resetPasswordValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = {
        password: this.state.newPassword,
        password_confirmation: this.state.confirmPassword,
        token: this.props.token
      }
      this.setState({ loading: true })
      let res = await ResetPasswordApi(body)
      try {
        if (res.data.status === 0) {
          this.setState({ errors: res.data.message, loading: false })
        } else if (res.data.status === 1) {
          const message = res.data.message;
          this.setState({ loading: false })
          Message('success', 'Success', message)
          $('.resetpassword-modal-lg').hide();
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
    const { newPassword, confirmPassword, errors, loading } = this.state
    return (
      <div className="modal login-signup fade resetpassword-modal-lg" tabIndex={-1} role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="login-signup-wrapper">
                <div className="row m-0">
                  <div className="col-lg-4 left p-0 ">
                    <div className="image">
                      <img src={BannerImage} alt="" className="img-fluid" />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="content-wrapper">
                      <div className="tab-content">
                        <div className="form-wrapper">
                          <div className="logo">
                            <img src={OlympusNFTLogo} alt="" className="img-fluid" />
                          </div>
                          <h4>Set New Password</h4>
                          <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                              <label htmlFor="exampleInputPassword1">New Password</label>
                              <input type="password" className="form-control" id="exampleInputPassword1" name='newPassword' value={newPassword} onChange={this.handleChange} placeholder="New Password" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleInputPassword2">Confirm Password</label>
                              <input type="password" className="form-control" id="exampleInputPassword2" name='confirmPassword' value={confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" />
                            </div>
                            <br />
                            <span className="m-auto" style={{ color: 'red', fontWeight: "bold" }}>{errors}</span>
                            {!loading ? <button type="submit" className="btn-default hvr-bounce-in">Reset Password</button> : <SmallLoader />}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
