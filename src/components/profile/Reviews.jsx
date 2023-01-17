import React, { useEffect, useState } from 'react';
import MyProfile from './MyProfile';
import ProfileSideBar from './ProfileSideBar';
import { UserProfileReviewsApi } from './../../container/Api/api';
import { Link } from 'react-router-dom';
import Loader from '../loader/Loader';
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import Photo from './../../assets/img/profile.jpeg'

const $ = window.jQuery;

function Reviews() {
	$(window).scrollTop('0');
	const [state, setState] = useState({
		isApiHit: false,
		query: '',
		data: [],
	});

	const [totalRecords, setTotalrecords] = useState('')
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		_fetchApiCall()
	}, [state.isApiHit]);

	async function _fetchApiCall() {
		if (!state.isApiHit) {
			let res = await UserProfileReviewsApi(state.query);
			try {
				if (res.data.status === 1) {
					let data = res.data.data;
					setState({
						...state,
						data,
						isApiHit: true
					});
					setLoading(false);
					setTotalrecords(res.data.total_records)
				} else if (res.data.status === 0) {
					setState({
						...state,
						data: [],
						isApiHit: true
					});
					setLoading(false);
				}
			} catch (err) {
				ErrorHandler(err)
			}
		}
	}

	const handleChangeCount = async (value) => {
		setCurrentPage(value)
		setLoading(true)
		let obj = {};
		if (value) {
			obj['offset'] = value - 1;
		}
		setState({
			...state,
			query: obj,
			isApiHit: false
		})
	}

	if (loading) {
		return <Loader />
	} else return (
		<div className='dashboard-wrapper main-padding'>
			<div className='row'>
				<ProfileSideBar />
				<div className='col-lg-9 col-md-8'>
					<div className='content-wrapper'>
						<MyProfile />
						<div className='content-box'>
							<h3>Product Reviews</h3>
							{state.data.length > 0 ? <div className='collection-items product-grid'>
								{state.data && state.data.length > 0 ? state.data.map((review, index) => {
									let percent = ((Number(review.rating) / 5) * 100);
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
								}) : 'There is no record'}

							</div>
								: ''}
							{totalRecords > 10 ? <Pagination
								current={currentPage}
								defaultCurrent={currentPage}
								total={totalRecords}
								onChange={handleChangeCount}
							/> : ''}

						</div>

					</div>
				</div>
			</div>
		</div>
	)
}
export default Reviews;
