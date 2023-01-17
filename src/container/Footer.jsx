import { Component } from "react";
import { connect } from "react-redux";
import { fetchSiteSettingData } from "./../store/actions/siteAction";
import { getCmsPagesApi, contactUs } from "../container/Api/api";
import { ErrorHandler, Message } from "../utils/message";

import { Link } from "react-router-dom";
import React from "react";
import footer2 from "./../assets/img/foote-2.png";
import callcenter from "./../assets/svg/call-center.svg";
import help from "./../assets/svg/help.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import MoonPayModal from "../components/modals/MoonPayModal";
import CompanyLogo from "./../assets/img/company-icon.svg";

class Footer extends Component {
  state = {
    cmsData: [],
    name: "",
    email: "",
    phone: "",
    message: "",
    errors: "",
  };
  componentDidMount() {
    this.props.dispatch(fetchSiteSettingData());
    this.fetchMyAPI();
  }
  fetchMyAPI = async () => {
    let res = await getCmsPagesApi();
    let data = [];
    if (res.status === 200) {
      data = res.data.data;
      this.setState({ cmsData: data });
    } else if (res.data.status === 0) {
      this.setState({ cmsData: data });
    }
  };

  onChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = this.state;
    const exp = /^\+?(0|[1-9]\d*)$/;
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const alph = /^[a-z A-Z]+$/;
    if (name === "") {
      this.setState({ errors: "Fullname is required!" });
    } else if (!name.match(alph)) {
      this.setState({ errors: "Fullname is not valid!" });
    } else if (email === "") {
      this.setState({ errors: "Email is required!" });
    } else if (!email.match(regexp)) {
      this.setState({ errors: "Email is not valid!" });
    } else if (message === "") {
      this.setState({ errors: "Message review is required!" });
    } else {
      this.setState({ errors: "" });

      try {
        let body = {
          name: name,
          email: email,
          message: message,
        };

        let res = await contactUs(body);

        if (res.data.status === 1) {
          Message("success", "Success", res.data.message);
          this.setState({ smallLoader: false });
        } else if (res.data.status === 0) {
          this.setState({ smallLoader: false });
          Message("error", "Error", res.data.message);
        }
      } catch (err) {
        ErrorHandler(err);
      }
    }
  };
  render() {
    const {
      loading,
      facebook,
      twitter,
      instagram,
      youtube,
      discord,
      site_mobile,
      site_phone,
      site_email,
    } = this.props;
    return (
      <React.Fragment>
        <section className="top_footer">
          <div className="container">
            <div className="row contact_detail">
              <div className="col-lg-6 justify-content-lg-start d-flex flex-column">
                <div className="reach_us">
                  <h3>Reach out to us</h3>
                </div>
                <div className="chatt_info ">
                  {/* <div className="chatt_part d-flex flex-column">
                    <div className="d-flex">
                      <div className="d-flex flex-column mr-5">
                        <div className="outer_box">
                          <img
                            src={callcenter}
                            alt="About"
                            className="img-fluid"
                          />
                        </div>
                        <div className="d-flex">
                          <h6>Chat with us directly</h6>
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="outer_box">
                          <img src={help} alt="About" className="img-fluid" />
                        </div>
                        <div className="d-flex">
                          <h6>Chat with us directly</h6>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="cell_detail d-flex _space align-items-center ">
                    <div className="d-flex">
                      <FontAwesomeIcon icon={faPhoneVolume} />
                    </div>
                    <div className="d-flex flex-column  ml-3">
                      <div className="d-flex">
                        <h5>Call</h5>
                      </div>
                      <div className="d-flex">
                        <p>
                          <a href={`tel:${site_phone}`}>{site_phone}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="cell_detail d-flex _space2 align-items-center">
                    <div className="d-flex">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="d-flex flex-column ml-3">
                      <div className="d-flex">
                        <h5>Email</h5>
                      </div>
                      <div className="d-flex">
                        <p>
                          <a href={`mailto:${site_email}`}>{site_email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6  justify-content-lg-start justify-content-center">
                <div className="reach_us">
                  <h3>Contact Us</h3>
                </div>
                <div className="chatt_info">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      placeholder="Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      rows="6"
                      id="exampleForm.ControlTextarea1"
                      className="form-control"
                      placeholder="Message"
                      name="message"
                      value={this.state.message}
                      onChange={this.onChange}
                    ></textarea>
                  </div>
                  {this.state.errors ? (
                    <div className="alert alert-danger">
                      {this.state.errors}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="form-group d-flex justify-content-end submit">
                    <div className="button-holder">
                      <a
                        className="btn"
                        onClick={(e) => {
                          this.onSubmit(e);
                        }}
                      >
                        Submit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          id="community"
          className="footer-bottom d-flex justify-content-center align-items-center"
        >
          <div className="container">
            <div className="d-flex flex-md-row flex-column justify-content-md-start justify-content-md-center align-items-md-start align-items-center">
              <div className="d-flex  justify-content-md-start flex-fill  align-items-center">
                <p>© 2021 Arhamsoft. All Rights Reserved</p>
              </div>
              <div className="social-icons d-flex">
                <div>
                  <a href={youtube} target="_blank">
                    <FontAwesomeIcon icon={faPlay} />
                  </a>
                </div>
                <div>
                  <a href={twitter} target="_blank">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </div>
                <div>
                  <a href={instagram} target="_blank">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
                <div>
                  <a href={facebook} target="_blank">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                </div>
                <div>
                  <a href={discord} target="_blank">
                    <FontAwesomeIcon icon={faDiscord} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <span className="d-flex">
            <a href="https://www.arhamsoft.com/" target="_blank">
              <img src={CompanyLogo} className="img-fluid" alt="" />
            </a>
          </span>
        </div>

        {/* <MoonPayModal /> */}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.siteSettingReducer.loading,
    facebook: state.siteSettingReducer.facebook,
    twitter: state.siteSettingReducer.twitter,
    discord: state.siteSettingReducer.discord,
    instagram: state.siteSettingReducer.insta,
    youtube: state.siteSettingReducer.youtube,
    site_mobile: state.siteSettingReducer.site_mobile,
    site_email: state.siteSettingReducer.site_email,
    site_phone: state.siteSettingReducer.site_phone,
  };
};
export default connect(mapStateToProps)(Footer);
