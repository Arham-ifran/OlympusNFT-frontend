import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchProductsByCategoryData } from "./../../store/actions/productsByCategory";
import TabLogoColor from "./../../assets/img/tab-logo-color.png";
import Tablogo from "./../../assets/img/tab-logo.png";
import { MainThreeCategoryApi } from "./../../container/Api/api";
import VideoImageThumbnail from "react-video-thumbnail-image";
import { usdSymbol, ethSymbol } from "../../constant/constant";
import SmallLoader from "../loader/SmallLoader";
import tabclorlogo from "./../../assets/img/tabcl_logo.png";
import range1 from "./../../assets/img/range1.png";
import tabs2 from "./../../assets/img/tabs_2.png";
import tabs3 from "./../../assets/img/tab_3.png";
import tabs4 from "./../../assets/img/tab_4.png";
import tabs5 from "./../../assets/img/tab_5.png";
import tabs6 from "./../../assets/img/tab_6.png";
import tabs7 from "./../../assets/img/tab_7.png";

class RangeCheck extends Component {
  state = {
    categoryData: [],
    categoryLoading: true,
    cat: 1,
    itemsData: [],
    dataLoading: true,
  };

  componentDidMount = async () => {
    this.props.dispatch(fetchProductsByCategoryData());
    let res = await MainThreeCategoryApi();
    try {
      if (res.data.status === 1) {
        let data = res.data.data.categories;
        this.setState({
          categoryData: data,
          categoryLoading: false,
          cat: data[0].id,
          itemsData: this.props.data,
          dataLoading: this.props.loading,
        });
      } else if (res.data.status === 0) {
        this.setState({
          categoryData: [],
          categoryLoading: false,
          itemsData: this.props.data,
          dataLoading: this.props.loading,
        });
      }
    } catch (err) {
      console.error("error");
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.itemsData !== nextProps.itemsData) {
      return {
        itemsData: nextProps.data,
        dataLoading: nextProps.loading,
      };
    }
    return null;
  }

  render() {
    const { Logo } = this.props;
    const { categoryData, categoryLoading, cat, itemsData, dataLoading } =
      this.state;
    const mediaType =
      itemsData && Object.keys(itemsData).length > 0
        ? JSON.parse(itemsData[0].productMedia)
        : "";

    return (
      <>
        <section
          style={categoryLoading ? { display: "none" } : { display: "block" }}
          className="check-range -itegrate items_list"
        >
          <div className="container">
            <div className="section-heading  _tabs_list">
              <p className="ml-4">Check Our Range</p>
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  {categoryData && categoryData.length > 0
                    ? categoryData.map((item, i) => {
                        return (
                          <a
                            key={i}
                            className={
                              cat === item.id
                                ? "nav-item nav-link active"
                                : "nav-item nav-link"
                            }
                            onClick={() => {
                              this.setState({ cat: item.id });
                              this.props.dispatch(
                                fetchProductsByCategoryData(item.id)
                              );
                            }}
                          >
                            <img
                              src={tabclorlogo}
                              alt="About"
                              className="img-fluid mr-3 _sacle_iamge"
                            />
                            <img
                              src={Tablogo}
                              alt={item.title}
                              className="active  img-fluid"
                            />
                            {item.title}
                          </a>
                        );
                      })
                    : ""}
                </div>
              </nav>
            </div>

            {!dataLoading && Object.keys(itemsData).length > 0 ? (
              <div className="tab-content" id="nav-tabContent ">
                <div
                  className="tab-pane fade show active mt-5"
                  id="nav-home"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                >
                  <div className="items--list">
                    <div className="row m-0 w-100">
                      <div className="col-lg-4 p-0">
                        <div className="items--list full">
                          <div className="item">
                            <div className="image">
                              {mediaType &&
                              mediaType.fileType.includes("image") ? (
                                <img
                                  src={itemsData[0].ipfsImageHash}
                                  alt={itemsData[0].title}
                                  className="img-fluid"
                                />
                              ) : (
                                <VideoImageThumbnail
                                  snapshotAtTime={0}
                                  videoUrl={itemsData[0].ipfsImageHash}
                                  className="img-fluid"
                                  alt={itemsData[0].title}
                                />
                              )}
                            </div>
                            <div className="content">
                              <div className="artist-detail">
                                <div className="name">
                                  <h6>{itemsData[0].category} </h6>
                                  <p>{itemsData[0].title}</p>
                                </div>
                                <div className="number">
                                  <span>#{itemsData[0].TokenId}</span>
                                </div>
                              </div>
                              <div className="detail">
                                <div>
                                  <h6>
                                    {usdSymbol}
                                    {itemsData && itemsData.length > 0
                                      ? itemsData[0].priceUsd
                                      : ""}
                                  </h6>
                                </div>
                                <Link
                                  to={{
                                    pathname: `/product-detail/${itemsData[0].slug}/${itemsData[0].id}`,
                                  }}
                                  className="btn-default"
                                >
                                  Buy NFT
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 pr-sm-0">
                        <div className="items--list">
                          {itemsData && itemsData.length > 0
                            ? itemsData.map((item, i) => {
                                let mediaType = JSON.parse(item.productMedia);
                                if (i !== 0) {
                                  return (
                                    <>
                                      <div className="item" key={i}>
                                        <div className="image">
                                          {mediaType.fileType.includes(
                                            "image"
                                          ) ? (
                                            <img
                                              src={item.ipfsImageHash}
                                              alt={item.title}
                                              className="img-fluid"
                                            />
                                          ) : (
                                            <VideoImageThumbnail
                                              snapshotAtTime={0}
                                              videoUrl={item.ipfsImageHash}
                                              className="img-fluid"
                                              alt={item.title}
                                            />
                                          )}
                                        </div>
                                        <div className="content">
                                          <div className="artist-detail">
                                            <div className="name">
                                              <h6>{item.category}</h6>
                                              <p>{item.title}</p>
                                            </div>
                                            <div className="number">
                                              <span>#{item.TokenId}</span>
                                            </div>
                                          </div>
                                          <div className="detail">
                                            <div>
                                              <h6>
                                                {usdSymbol}
                                                {item.priceUsd}
                                              </h6>
                                            </div>
                                            <Link
                                              to={{
                                                pathname: `/product-detail/${item.slug}/${item.id}`,
                                              }}
                                              className="btn-default"
                                            >
                                              Buy NFT
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="tab_items_detail">
                                          <p>Ottoman Electro Music</p>
                                          <p className="mt-2">
                                            <span className="head">
                                              Seller:
                                            </span>{" "}
                                            {item.seller}
                                          </p>
                                          <div className="head mt-2">
                                            ${item.priceUsd}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              })
                            : ""}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : dataLoading ? (
              <div className="tab-content">
                <SmallLoader />
              </div>
            ) : itemsData.length < 1 ? (
              <div className="no-content-class">
                <h4>No Item Available</h4>
              </div>
            ) : (
              ""
            )}
          </div>
        </section>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.productsByCategoryReducer.data,
    loading: state.productsByCategoryReducer.loading,
  };
};

export default connect(mapStateToProps)(RangeCheck);
