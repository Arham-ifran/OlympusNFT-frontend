import Slider from "react-slick";
import { useEffect } from "react";
import { connect } from "react-redux";
import Item from "./Item";
import Logo from "./../../assets/img/olympusnft-logo.gif";
import { fetchMostWatchedProductData } from "./../../store/actions/mostWatchedProduct";

function MostWatchedSlide(props) {
  useEffect(() => {
    props.dispatch(fetchMostWatchedProductData());
  }, []);

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    pauseOnHover: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
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

  if (props.data && props.data.length > 0) {
    return (
      <section className="most-watched">
        <div className="container">
          <div className="section-heading main-padding">
            <h2>Most Popular Items</h2>
          </div>
          <Slider {...settings} className="items--list">
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
                    price={item.priceUsd}
                    id={item.id}
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

export default connect(mapStateToProps)(MostWatchedSlide);
