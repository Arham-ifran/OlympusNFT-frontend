import React, { useEffect, useState } from 'react';
import { UserProductsReviews } from '../../container/Api/api'
import { Link } from 'react-router-dom'
import Loader from '../loader/Loader';
import Photo from './../../assets/img/profile.jpeg'

function Reviews(props) {
  const [reviewsData, setreviewsData] = useState([])
  const [loading, setLoaing] = useState(true)

  useEffect(() => {
    _fetch()
  }, []);

  async function _fetch() {
    let res = await UserProductsReviews(props.username)
    if (res.status === 200) {
      let data = res.data.data;
      setreviewsData(data)
      setLoaing(false)
    } else if (res.data.status === 0) {
      setreviewsData([])
    }
  }

  let ratingPercentage = (props.totalRating / (props.totalReview * 5) * 100);
  return (

    <>
      <div className='content-box'>
        <h3>Reviews</h3>
        <div className='content'>
          <h5>Overall rating</h5>
          <div className='item'>
            <span className='title'>Seller's rating:</span>
            <span className='reviews'>
              <div className="starsRating">
                <span style={{ width: `${ratingPercentage}%` }}></span>
              </div>
              <span className='rating'><span>({(props.totalRating / props.totalReview)})</span></span>
            </span>
          </div>
          <p>({props.totalReview} Reviews)</p>
        </div>

        {reviewsData && reviewsData.length > 0 ? reviewsData.map((review, index) => {
          let percent = ((review.rating / 5) * 100);
          return <div className="review-detail" key={index}>
            <div className="item">
              <div className="review-sec">
                <div className="customer-detail">
                  <div className="profile-image">
                    <img src={review.reviewerUser.profileImage ? review.reviewerUser.profileImage : Photo} alt="{review.reviewerUser.username}" className="img-fluid" />
                  </div>
                  <div className="name-date">
                    <h5>{review.reviewerUser.username}</h5>
                    <span>{review.createdAt}</span>
                  </div>
                </div>
                <div className='reviews'>
                  <div className="starsRating">
                    <span style={{ width: `${percent}%` }}></span>
                  </div>
                </div>
                <p>{review.review}</p>
              </div>
              <div className="product-sec">
                <h6><Link to={{ pathname: `/product-detail/${review.product.slug}/${review.product.id}` }}>{review.product.title}</Link></h6>
                <p>{review.product.subTitle}</p>
              </div>
            </div>

          </div>
        }) : ""}

      </div>
    </>
  )
}
export default Reviews;