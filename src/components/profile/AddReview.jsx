import React, { useEffect, useState } from 'react';
import ProfileSideBar from "../profile/ProfileSideBar";
import { addReviewsApi, ReviewsDetailsApi } from './../../container/Api/api';
import { ErrorHandler, Message } from './../../utils/message';
import Loader from "../loader/Loader";
import { Link } from 'react-router-dom'
import VideoImageThumbnail from 'react-video-thumbnail-image';
const $ = window.jQuery;

function AddReview(props) {
  $(window).scrollTop('0');


  const [state, setState] = useState({
    product_id: props.match.params.productId,
    order_id: props.match.params.orderId,
    loading: true,
    productData: '',
    user_id: localStorage.getItem('id'),
    rating: '',
    review: '',
    review_title: ''
  });
  useEffect(() => {
    _fetchApiCall()
  }, [])

  async function _fetchApiCall() {
    let res = await ReviewsDetailsApi(state.order_id);
    try {
      if (res && res.data && res.data.status === 1) {
        setState({
          ...state,
          productData: res.data.data,
          loading: false,
        });
      } else if (res && res.data && res.data.status === 0) {
        setState({
          ...state,
          productData: '',
          loading: false
        })
      }
    } catch (err) {
      ErrorHandler(err)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state.rating && state.user_id && state.product_id) {
        let body = {};
        body['rating'] = state.rating;
        body['user_id'] = state.user_id;
        body['product_id'] = state.product_id;
        body['order_id'] = state.order_id;
        if (state.review) {
          body['review'] = state.review;
        }
        if (state.review_title) {
          body['review_title'] = state.review_title;
        }
        let res = await addReviewsApi(body)
        if (res && res.status && res.status === 200 && res.data.status == 1) {
          setState({
            ...state,
            rating: '',
            review: '',
            review_title: ''
          })
          Message('success', 'Success', 'Successfully review added.')
        } else if (res && res.status && res.status === 200 && res.data.status == 0) {
          Message('error', 'Error', 'Review is already added for this order.')
        } else {
          setState({
            ...state,
            rating: '',
            review: '',
            review_title: ''
          })
        }
      } else {
        Message('error', 'Error', 'Please rate the product')
      }
    }
    catch (error) {
      ErrorHandler(error)
    }
  }


  const mediaType = state.productData && Object.keys(state.productData).length > 0 ? JSON.parse(state.productData.productMedia) : '';
  if (state.loading) {
    return <Loader />
  } return (
    <div className='dashboard-wrapper main-padding'>
      <div className='row'>
        <ProfileSideBar />
        <div className='col-lg-9 col-md-8'>
          <div className='content-wrapper'>
            <div className='content-box'>
              <div className="row">
                <div className="col-md-6">
                  <form onSubmit={submitHandler}>
                    <h3><Link to={{ pathname: `/product-detail/${state.productData.productSlug}/${state.productData.productId}` }}>{state.productData.productTitle}</Link></h3>

                    {mediaType && mediaType.fileType.includes('image') ? <img src={state.productData.ipfsImageHash} alt={state.productData.title} className="img-fluid" style={{ width: '200px', height: 'auto' }} /> : <VideoImageThumbnail snapshotAtTime={0}
                      videoUrl={state.productData.ipfsImageHash}

                      className="img-fluid"
                      width={200}
                      alt={state.productData.title}
                    />}
                    <br />
                    <br />
                    <div className="form-group">
                      <label for="rating">Rate</label>
                      <div className='content-wrapper'>
                        <div className="starsRatings">
                          <input type="radio" value="1" name="rating" className="star-1" id="star1-1" onChange={() => setState({ ...state, rating: 1 })} required />
                          <label className="star-1" for="star1-1">1</label>
                          <input type="radio" value="2" name="rating" className="star-2" id="star1-2" onChange={() => setState({ ...state, rating: 2 })} />
                          <label className="star-2" for="star1-2">2</label>
                          <input type="radio" value="3" name="rating" className="star-3" id="star1-3" onChange={() => setState({ ...state, rating: 3 })} />
                          <label className="star-3" for="star1-3">3</label>
                          <input type="radio" value="" name="rating" className="star-4" id="star1-4" onChange={() => setState({ ...state, rating: 4 })} />
                          <label className="star-4" for="star1-4">4</label>
                          <input type="radio" value="" name="rating" className="star-5" id="star1-5" onChange={() => setState({ ...state, rating: 5 })} />
                          <label className="star-5" for="star1-5">5</label>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label for="review_title">Review Title</label>
                      <input type="text" className="form-control" name="review_title" onChange={(e) => setState({ ...state, review_title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label for="review">Remark</label>
                      <textarea className="form-control" rows="5" onChange={(e) => setState({ ...state, review: e.target.value })} ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit Review</button>

                  </form>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default AddReview;