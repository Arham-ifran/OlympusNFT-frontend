import React, { Component } from 'react'
import BannerImage from './../../assets/img/banner-2.png'
import OlympusNFTLogo from './../../assets/img/olympusnft-logo.gif'
import { changePassword } from './Validation'
import { ChangePasswordApi } from './../../container/Api/api'
import Swal from 'sweetalert2'


export default class ChangePassword extends Component {
  state = {
    current_password: '',
    new_password: '',
    errors: '',
    isSubmitted: false,
    loading: false,
    success: false
  }

  handleChangePassword = (e) => {
    this.setState({
      [e.target.name]: e.target.value, errors: ''
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = changePassword(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = { current_password: this.state.current_password, new_password: this.state.new_password }
      try {
        let res = await ChangePasswordApi(body)
        if (res.data.status === 1) {
          const message = res.data.message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            showConfirmButton: false,
            timer: 1500
          })
          this.setState(() => { return { success: true } })
          window.location.reload(true)
        }
      } catch (error) {
        if (error.response.data.status === 0) {
          const errors = error.response.data.message
          this.setState(() => { return { errors, success: false } })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Sorry! we can`t proceed your request',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    }
  }

  render() {
    const { current_password, new_password, errors, success } = this.state;
    return (
      <>
        <div className="modal login-signup fade changePassword-modal-lg" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <button type='button' className='close' data-dismiss="modal" aria-label="Close">
                <span aria-hidden='true'>×</span>
              </button>
              <div className="modal-body">
                <div className="login-signup-wrapper">
                  <div className="row m-0">
                    <div className="col-lg-4 left p-0 ">
                      <div className="image">
                        <img src={BannerImage} alt="" className="img-fluid" />
                      </div>
                    </div>
                    <div className="col-lg-8 right">
                      <div className="content-wrapper">
                        <div className="tab-content">
                          <div className="tab-pane fade show active" >
                            <div className="form-wrapper">
                              <div className="logo">
                                <img src={OlympusNFTLogo} alt="" className="img-fluid" />
                              </div>
                              <h4>Change Password</h4>
                              <form onSubmit={this.handleSubmit} style={success ? { display: 'none' } : { display: 'block' }}>
                                <div className="form-group">
                                  <label >Current Password</label>
                                  <input type="password" className="form-control" name='current_password' value={current_password} onChange={this.handleChangePassword} placeholder="New Password" />
                                </div>
                                <div className="form-group">
                                  <label>New Password</label>
                                  <input type="password" className="form-control" name='new_password' value={new_password} onChange={this.handleChangePassword} placeholder="Confirm Password" />
                                </div>
                                <br />
                                <div className={errors ? "alert alert-danger m-auto" : ''} role="alert" style={{ color: 'red', fontWeight: "bold" }}>{errors}</div>
                                <button type="submit" className="btn-default hvr-bounce-in">Change Password</button>
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
        </div>
      </>
    )
  }
}