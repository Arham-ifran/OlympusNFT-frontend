import s1 from "./../../assets/img/s1.png";
import s2 from "./../../assets/img/s2.png";
import s3 from "./../../assets/img/s3.png";
import s4 from "./../../assets/img/s4.png";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";
const $ = window.jQuery;

export default function AboutAndWhy({ Image, homeVideo }) {
  const [isPlay, setIsPlay] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const openVideoHandler = (url) => {
    setIsPlay(true);
    setVideoUrl(url);
    $(`#myYoutubeModal`).modal("show");
  };

  const isModalClose = () => {
    setIsPlay(false);
    setVideoUrl("");
    $(`#myYoutubeModal`).modal("hide");
  };
  return (
    <>
      <section className="about-why">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-nexces">
                <h3>About & Why</h3>
                <p className="pt-3">
                  Nulla in euismod magna. Mauris et tincidunt enim. Aenean
                  lobortis nisl in erat tempor porta. In sagittis condimentum
                  sapien, sit amet rutrum nunc laoreet id. Maecenas pulvinar
                  felis nisi, quis aliquam metus lacinia ac.
                </p>
                <p>
                  Nunc suscipit auctor augue sed tincidunt. Etiam varius, nibh
                  at tincidunt viverra, urna est tempus justo, nec rhoncus ex
                  enim non tellus. Proin eget ipsum a eros tempor cursus quis
                  non tortor.{" "}
                </p>
              </div>
              <div className="d-flex mt-4 mb-lg-0 mb-3 justify-content-md-start justify-content-md-center">
                <div className="play-v">
                  <div className="play-v-2">
                    <a onClick={() => openVideoHandler(homeVideo)}>
                      <FontAwesomeIcon icon={faPlay} />
                    </a>
                  </div>
                </div>
                <div className="d-flex watch flex-column justify-content-center ml-4">
                  <div className="d-flex">
                    <h3>Watch Video</h3>
                  </div>
                  <div className="d-flex">
                    <p>How it works</p>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="col-lg-6 d-flex align-items-center _detail-about">
              <div className="row">
                <div className="col-lg-6 mt-lg-0 mt-3">
                  <div className="services d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex">
                      <img src={s1} alt="About" className="img-fluid" />
                    </div>
                    <div className="d-flex">
                      <h6>Traditional Assets</h6>
                    </div>
                    <div className="d-flex">
                      <p>Kil uisquam est qui doloeque porr orem amoloe.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-lg-0 mt-3">
                  <div className="services d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex">
                      <img src={s2} alt="About" className="img-fluid" />
                    </div>
                    <div className="d-flex">
                      <h6>Invest</h6>
                    </div>
                    <div className="d-flex">
                      <p>Neque porro quisquam est qui dolorem amet</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="services d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex">
                      <img src={s3} alt="About" className="img-fluid" />
                    </div>
                    <div className="d-flex">
                      <h6>Secure</h6>
                    </div>
                    <div className="d-flex">
                      <p>Neque porro quisquam est qui dolorem amet</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-3">
                  <div className="services d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex">
                      <img src={s4} alt="About" className="img-fluid" />
                    </div>
                    <div className="d-flex">
                      <h6>World Wide Range</h6>
                    </div>
                    <div className="d-flex">
                      <p> Kil uisquam est qui doloeque porr orem amoloe.</p>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="myYoutubeModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  data-backdrop="static"
                  data-keyboard="false"
                >
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button
                          onClick={() => isModalClose()}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="embed-responsive embed-responsive-16by9">
                          <ReactPlayer
                            playing={isPlay}
                            controls={true}
                            url={videoUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
