import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  supportedNetworkVersions,
  supportedNetworks,
} from "./../../constant/constant";
import { Message } from "../../utils/message";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import StickyVideo from "react-sticky-video";
import "react-sticky-video/dist/index.css";
import top3 from "./../../assets/img/top3.png";
import top1 from "./../../assets/img/top1.png";
import top2 from "./../../assets/img/top2.png";
import { fetchtopSellingProductsData } from "./../../store/actions/topSellingProducts";
import VideoImageThumbnail from "react-video-thumbnail-image";

const $ = window.jQuery;

function GettingStarted(props) {
  let connected = Boolean(localStorage.getItem("walletConn"));
  let token = Boolean(localStorage.token);
  const [redirect, setRedirect] = useState(false);
  const [connect, setConnect] = useState(false);

  useEffect(() => {

    props.dispatch(fetchtopSellingProductsData());
    if (connected) {
      setConnect(true);
    } else if (!connected) {
      setConnect(false);
    }
  }, [props.walletConnection]);

  useEffect(() => {
    if (connected) {
      setConnect(true);
    } else if (!connected) {
      setConnect(false);
    }
  }, [token, props.token]);

  const openTab = () => {
    if (
      !connected ||
      connected === null ||
      supportedNetworkVersions.indexOf(window.ethereum.networkVersion) === -1
    ) {
      Message(
        "error",
        "Sorry",
        "Please Connect to supported network (" +
        supportedNetworks +
        ") first or connect wallet."
      );
      return;
    } else {
      setRedirect(true);
    }
  };

  const openSignUpTab = (param) => {
    $(`#${param}`).tab("show");
  };

  if (redirect) {
    return <Redirect to="/create-item" />;
  }
  return (
    <>
      {/* <section className="getting-started">
        <div className="mb-5 video"> */}
      {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/FiK7s_0tGsg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
      {/* <StickyVideo
          url={props.homeVideo}
          playerVars={{
            autoplay: false,
          }}
          width={560}
          height={315}
          originalControls={true}
          stickyConfig={{
            width: 320,
            height: 315,
            position: "top-right",
          }}
        /> */}
      {/* </div> */}
      {/* </section> */}
      <section className="top-selling">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3>Top Selling Items </h3>
            </div>
          </div>
          <div className="row mt-5">
            {props.topSellingProducts && props.topSellingProducts.map((data, key) => {
              let mediaType = JSON.parse(data.productMedia);
              return (
                <>
                  {(key) == 0 ? <div className="col-md-6">
                    <div className="image_box">
                      <div className="d-flex">
                      {mediaType &&
                                mediaType.fileType.includes("image") ? (
                                <img
                                  src={data.ipfsImageHash}
                                  alt={data.title}
                                  className="img-fluid"
                                />
                              ) : (
                                <VideoImageThumbnail
                                  snapshotAtTime={0}
                                  videoUrl={data.ipfsImageHash}
                                  className="img-fluid"
                                  alt={data.title}
                                />
                              )}
                      </div>
                      <div className="top_3 d-flex justify-content-center">
                        <div className="d-flex flex-fill flex-column">
                          <h6>{data.title}</h6>
                          <p>{data.seller}</p>
                        </div>
                        <div className="d-flex align-items-center _common">
                          <div className="button-holder">
                            <Link
                              to={{ pathname: `/product-detail/${data.slug}/${data.id}` }}
                              className="btn"
                            >Buy Now

                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : <div className="col-md-6">
                    <div className="d-flex flex-column">
                      <div className="d-flex">
                        <div className="image_box items-box">
                          <div className="d-flex">
                          {mediaType &&
                                mediaType.fileType.includes("image") ? (
                                <img
                                  src={data.ipfsImageHash}
                                  alt={data.title}
                                  className="img-fluid"
                                />
                              ) : (
                                <VideoImageThumbnail
                                  snapshotAtTime={0}
                                  videoUrl={data.ipfsImageHash}
                                  className="img-fluid"
                                  alt={data.title}
                                />
                              )}
                          </div>
                          <div className="top_1 d-flex justify-content-center">
                            <div className="d-flex flex-fill flex-column">
                              <h6>{data.title}</h6>
                              <p>{data.seller}</p>
                            </div>
                            <div className="d-flex align-items-center _common">
                              <div className="button-holder">
                                <Link
                                  to={{ pathname: `/product-detail/${data.slug}/${data.id}` }}
                                  className="btn"
                                >Buy Now

                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="d-flex">
                        <div className="image_box items-box space">
                          <div className="d-flex">
                            <img src={top2} alt="About" className="img-fluid" />
                          </div>
                          <div className="top_2 d-flex justify-content-center">
                            <div className="d-flex flex-fill flex-column">
                              <h6>The Silver Clue - suspect</h6>
                              <p>NFT TREASURE HUNT - The Silver Clue</p>
                            </div>
                            <div className="d-flex align-items-center _common">
                              <div className="button-holder">
                                <a className="btn" href="r">
                                  Buy Now
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>}
                </>
              )
            })}


          </div>
        </div>

      </section>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    walletConnection: state.userReducer.walletConnection,
    token: state.userReducer.token,
    homeVideo: state.siteSettingReducer.homeVideo,
    topSellingProducts: state.topSellingProductsReducer.data

  };
};

export default connect(mapStateToProps)(GettingStarted);
