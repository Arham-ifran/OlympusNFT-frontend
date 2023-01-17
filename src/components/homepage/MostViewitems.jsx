import Slider from "react-slick";
import { useEffect } from "react";
import { connect } from "react-redux";
import Item from "./Item";
import Logo from "./../../assets/img/olympusnft-logo.gif";
import { fetchMostWatchedProductData } from "./../../store/actions/mostWatchedProduct";
import LeftArrow from "./../../assets/img/left-arrow.png";
import RightArrow from "./../../assets/img/right-arrow.png";
import { useMediaQuery } from "react-responsive";

function MostViewitems(props) {
  useEffect(() => {
    props.dispatch(fetchMostWatchedProductData());
  }, []);

  const sliderSetting = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 200000,
    centerPadding: "10",
    infinite: false,
    arrows: true,
    prevArrow: <MostViewPrevArrow />,
    nextArrow: <MostViewNextArrow />,
    dots: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  function MostViewNextArrow(props) {
    const { onClick } = props;
    return (
      <div onClick={onClick} className="sliderRightArrow">
        <img
          onClick={onClick}
          src={RightArrow}
          alt="right-arrow.png"
          className="img-fluid slick-arrow next"
        />
      </div>
    );
  }

  function MostViewPrevArrow(props) {
    const { onClick } = props;
    return (
      <div onClick={onClick} className="sliderLeftArrow">
        <img
          onClick={onClick}
          src={LeftArrow}
          alt="left-arrow.png"
          className="img-fluid slick-arrow prev"
        />
      </div>
    );
  }

  if (props.data && props.data.length > 0) {
    return (
      <section className="MostViewitems art-nft-guide">
        <div className="container">
          <div className="d-flex title">
            <h3>Most Viewed Items</h3>
          </div>

          <Slider
            {...sliderSetting}
            className="viewitem_slide items--list mt-5"
          >
            {props.data.map((item, i) => {
              let mediaType = JSON.parse(item.productMedia);
              return (
                <div className="item" key={i}>
                  <Item
                    Logo={Logo}
                    Image={item.ipfsImageHash}
                    slug={item.slug}
                    Title={item.title}
                    Store={item.store}
                    id={item.id}
                    price={item.priceUsd}
                    mediaType={mediaType}
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
    );
  } else return null;
}
const mapStateToProps = (state) => {
  return {
    data: state.mostWatchedProductReducer.data,
    loading: state.mostWatchedProductReducer.loading,
  };
};

export default connect(mapStateToProps)(MostViewitems);
