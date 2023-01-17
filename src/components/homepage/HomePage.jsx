import Logo from "./../../assets/img/olympusnft-logo.gif";
import AboutImage from "./../../assets/img/about.png";
import ArtCommerce from "./../../assets/img/art-commerce.svg";
import { withRouter } from "react-router-dom";

import GetStart from "./../../assets/img/getting-started.png";

import React, { Suspense, useEffect, useState, Fragment } from "react";
import Slider from "react-slick";
import MostViewitems from "./MostViewitems";
import Blockchain from "./Blockchain";
import Ecommerce from "./Ecommerce";
import CreatorInvestor from "./CreatorInvestor";
import AboutAndWhy from "./AboutAndWhy";
import GettingStarted from "./GettingStarted";
import RangeCheck from "./RangeCheck";
import Loader from "../loader/Loader";
import { connect } from "react-redux";
import { selectedUserType } from "./../../store/actions/userAction";
import { fetchBannerImagesData } from "./../../store/actions/siteAction";
const MostWatchedSlide = React.lazy(() => import("./MostWatchedSlide"));
const $ = window.jQuery;

function HomePage(props) {
  $(window).scrollTop("0");

  const settings = {
    className: "slick-center",
    loop: true,
    infinite: true,
    centerPadding: "15px",
    slidesToShow: 3,
    speed: 2000,
    dots:true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  // const [videoGuideData, setVideoGuideData] = useState([]);
  const [ownToken, setOwnToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // fetchVideoGuide();
    props.dispatch(fetchBannerImagesData());
  }, []);
  const openSignUpTab = (param, value) => {
    $(`#${param}`).tab("show");
    props.dispatch(selectedUserType(value));
  };
  // async function fetchVideoGuide() {
  //   let res = await VideoGuideAPi();
  //   if (res.data.status === 0) {
  //     setVideoGuideData([]);
  //   } else if (res.data.status === 1) {
  //     setVideoGuideData(res.data.data);
  //   }
  // }

  useEffect(() => {
    setOwnToken(localStorage.getItem("token"));
  }, [props.token]);

  return (
    <Suspense fallback={<Loader />}>
      {/* <Loader /> */}
      {/* <BannerSlide /> */}
      <section className="banner-area baner_content ">
        <div className="container-fluid">
          <div className="row divider align-items-start">
            <div className="col-xl-5 ml-xl-0 ml-3">
              <div className="baner_content">
                <h1>Turn any creation into an item on the blockchain</h1>
                <p>
                  The world’s largest platform to simplify the process of
                  buying& selling rare collectibles
                </p>
                <div className="button-holder">
                  {!ownToken ? (
                    <a
                      className="btn"
                      data-toggle="modal"
                      data-target=".bd-example-modal-lg"
                      onClick={() => openSignUpTab("v-pills-signup-tab", 1)}
                    >
                      Create Account
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="viewitem_slider">
                {props.BannerImages.length > 0 ? (
                  <Slider {...settings} className="artist-list">
                    {props.BannerImages.map((item, i) => {
                      return (
                        <div className="home_slider" key={i}>
                          <img
                            loading="lazy"
                            src={item.bannerImage}
                            alt={item.bannerTitle}
                            className="img-fluid"
                          />
                          <div className=" d-flex flex-column">
                            <div className="slider_content d-flex flex-column">
                              <span className="card-price">
                                <span className="text_">
                                  {item.bannerTitle}
                                  {/* {item.bannerSubTitle ? item.bannerSubTitle : ''} */}
                                  {/* {item.bannerDescription ? item.bannerDescription : ''} */}
                                </span>
                              </span>
                              {/* {!ownToken ?
                          <div className="d-flex _common mt-2 ml-3 mb-3">
                            <div className="button-holder">
                               <a className="btn" data-toggle='modal' data-target='.bd-example-modal-lg' onClick={() => openSignUpTab('v-pills-signup-tab', i + 1)}>
                               Signup Now
                            </a> 
                            </div>
                          </div>: ''} */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Ecommerce Image={ArtCommerce} Logo={Logo} />
      <CreatorInvestor Logo={Logo} />
      <AboutAndWhy Image={AboutImage} homeVideo={props.homeVideo} />
      {/* <MostWatchedSlide /> */}
      <GettingStarted
        Logo={Logo}
        Image={GetStart}
        isAuthenticated={props.token}
      />
      <RangeCheck Logo={Logo} />
      {/* <ItemsOfDay /> */}

      <MostViewitems />
      <Blockchain />
    </Suspense>
  );
}
const mapStateToProps = (state) => {
  return {
    homeVideo: state.siteSettingReducer.homeVideo,
    BannerImages: state.siteSettingReducer.bannerImages,
    token: state.userReducer.token,
    loading: state.userReducer.loading,
  };
};

export default connect(mapStateToProps)(withRouter(HomePage));
