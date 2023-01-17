import React from "react";
import tabclorlogo from "./../../assets/img/tabcl_logo.png";
import range1 from "./../../assets/img/range1.png";
import tabs2 from "./../../assets/img/tabs_2.png";
import tabs3 from "./../../assets/img/tab_3.png";
import tabs4 from "./../../assets/img/tab_4.png";
import tabs5 from "./../../assets/img/tab_5.png";
import tabs6 from "./../../assets/img/tab_6.png";
import tabs7 from "./../../assets/img/tab_7.png";

function ItemsOfDay(props) {
  return (
    <React.Fragment>
      <section className="items_list">
        <div className="container">
          <div className="row _tabs_list justify-content-center align-items-center">
            <div className="col-2">
              <p>Check Our Range</p>
            </div>
            <div className="col-10 d-flex justify-content-end">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true" >
                    <img src={tabclorlogo} alt="About" className="img-fluid mr-3 _sacle_iamge" /> Music
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="profile-tab"
                    data-toggle="tab"
                    href="#profile"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    <img
                      src={tabclorlogo}
                      alt="About"
                      className="img-fluid mr-3 _sacle_iamge"
                    />
                    Art
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="contact-tab"
                    data-toggle="tab"
                    href="#contact"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    <img
                      src={tabclorlogo}
                      alt="About"
                      className="img-fluid mr-3 _sacle_iamge"
                    />
                    Film
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content  mt-5" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="row">
                <div className="col-md-4">
                  <div className="big_imag">
                    <div className="numbers">
                      <span className="circle">
                        <h3>#3</h3>
                      </span>
                    </div>
                    <div className="-text_area1 d-flex flex-column _inf0">
                      <div className="d-flex">
                        <h2>Item of the Day</h2>
                      </div>
                      <div className="d-flex">
                        <p>Chrysalis</p>
                      </div>
                    </div>
                    <img src={range1} alt="About" className="img-fluid" />
                    <div className="-text_area2 d-flex _inf0">
                      <div className="d-flex">
                        <div className="_blue_strip flex-column">
                          <h2>$485.34 </h2>
                          <p>or 0.250003 ETH</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center _common ml-3">
                        <div className="button-holder">
                          <a className="btn" href="r">
                            Buy Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs2} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs3} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs4} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs5} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs6} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="tabs_stock">
                        <img src={tabs7} alt="About" className="img-fluid" />
                        <div className="tab_items_detail">
                          <p>Ottoman Electro Music</p>
                          <p className="mt-2">
                            <span className="head">Seller:</span> cnozkrl
                          </p>
                          <div className="head mt-2">$101.25</div>
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
    </React.Fragment>
  );
}
export default ItemsOfDay;
