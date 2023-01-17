import React from 'react';
import ForgetPassword from './ForgetPassword'
import Signin from './Signin'
import Signup from './Signup'
import BannerImage from './../../assets/img/banner-2.png'
import OlympusNFTLogo from './../../assets/img/art-nft-logo.png'
import Logo from './../../assets/img/olympusnft-logo.gif'

function LogModals() {
  return (
    <>
      <div className="modal fade bd-example-modal-lg login-signup" tabIndex={-1} role="dialog" id="myLargeModalLabel" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="login-signup-wrapper">
                <div className="row m-0">
                  <div className="col-lg-4 left p-0 ">
                    <div className="image">
                      <img src={BannerImage} alt="" className="img-fluid" />
                    </div>
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                      <a className="nav-link active" id="v-pills-login-tab" data-toggle="pill" href="#v-pills-login" role="tab" aria-controls="v-pills-login" aria-selected="true">Log In</a>
                      <a className="nav-link" id="v-pills-signup-tab" data-toggle="pill" href="#v-pills-signup" role="tab" aria-controls="v-pills-signup" aria-selected="false">Sign Up</a>
                    </div>
                  </div>
                  <div className="col-lg-8 right">
                    <div className="content-wrapper">
                      <div className="tab-content" id="v-pills-tabContent">
                        <Signin OlympusNFTLogo={OlympusNFTLogo} Logo={Logo} />
                        <Signup OlympusNFTLogo={OlympusNFTLogo} Logo={Logo} />
                        <ForgetPassword OlympusNFTLogo={OlympusNFTLogo} Logo={Logo} />
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

export default LogModals;