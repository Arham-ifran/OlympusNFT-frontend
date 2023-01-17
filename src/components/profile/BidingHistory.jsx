import React, { useState, useEffect } from "react";
import ProfileSideBar from "../profile/ProfileSideBar";
import { Link } from "react-router-dom";
import { getBidingHistoryApi } from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd'
import Countdown from 'react-countdown';
import { usdSymbol } from '../../constant/constant'
import VideoImageThumbnail from 'react-video-thumbnail-image';

const Completionist = () => <span>Expired</span>;
const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		return <Completionist />;
	} else {
		return <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
			{days}:{hours}:{minutes}:{seconds}
		</span>
	}
}

const $ = window.jQuery;

function BidingHistory() {
	$(window).scrollTop('0');

	const [state, setState] = useState({
		data: [],
		totalRecords: 0,
		loading: true,
		currentPage: 0,
		searchVal: '',
		isApiHit: false
	});

	useEffect(() => {
		_fetchApiCall()
	}, [state.isApiHit]);

	async function _fetchApiCall() {
		if (!state.isApiHit) {
			let query = `&offset=${state.currentPage}`
			let res = await getBidingHistoryApi(query);
			try {
				if (res && res.data && res.data.status === 1) {
					setState({
						data: res.data.data,
						loading: false,
						totalRecords: res.data.total_records,
						isApiHit: true
					});
				} else if (res && res.data && res.data.status === 0) {
					setState({
						data: [],
						totalRecords: 0,
						loading: false,
						currentPage: 0,
						searchVal: '',
						isApiHit: false
					})
				}
			} catch (err) {
				ErrorHandler(err)
			}
		}
	}

	const handleChangeCount = async (value) => {
		setState({
			...state,
			currentPage: value - 1,
			isApiHit: false
		})
	}

	if (state.loading) {
		return <Loader />
	}

	return (
		<>
			<div className="dashboard-wrapper main-padding current-item">
				<div className="row">
					<ProfileSideBar />
					<div className="col-lg-9 col-md-8">
						<div className="content-wrapper">
							<div className="content-box">
								<h2 className="mb-4">Biding History</h2>
								<div className="table">
									<table className="table table-bordered">
										<thead>
											<tr>
												<th>Item Name</th>
												<th>Bid Amount</th>
												<th>Total Bids</th>
												<th>Time Left</th>
												<th>Created at</th>
											</tr>
										</thead>
										<tbody>
											{state.data && Object.keys(state.data).length > 0 ? state.data.map((item, index) => {
												let mediaType = JSON.parse(item.productMedia);
												return <tr>
													<td>
														{mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" width="50px" height="50px" /> : <VideoImageThumbnail snapshotAtTime={0}
															videoUrl={item.ipfsImageHash}
															className="img-fluid"
															width={50}
															height={50}
															alt={item.title}
														/>}
														<Link to={{ pathname: `/product-detail/${item.productSlug}/${item.productId}` }}>{item.productTitle}</Link>
													</td>
													<td>{usdSymbol}{item.bidAmount}</td>
													<td>{item.totalBids}</td>

													<td>{item.timeLeft !== "Expired" ?
														<Countdown
															date={new Date(Number(item.timeLeft) * 1000).getTime()}
															renderer={renderer}
														/> : "Expired"}</td>
													<td>{item.createdAt}</td>
												</tr>
											}) : <div className="no-content-class">
												<h4>No Item Available</h4>
											</div>}
										</tbody>
									</table>
								</div>
								{/*Pagination commented  */}
								<div className="collection-pagenation">
									{state.data.length > 10 ? <Pagination
										current={state.currentPage}
										defaultCurrent={state.currentPage}
										total={state.totalRecords}
										onChange={handleChangeCount}
									/> : ''}
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default BidingHistory;