import React, { useEffect, useState } from 'react';
import MyProfile from './MyProfile';
import ProfileSideBar from './ProfileSideBar';
import { UserItemsTransactionsApi } from './../../container/Api/api';
import Loader from '../loader/Loader';
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import { explorerNetworkURL, networkName } from '../../constant/constant'
import { getContractAddressByName } from "../../utils/contracts";

const $ = window.jQuery;
function History() {
	$(window).scrollTop('0');
	const [state, setState] = useState({
		isApiHit: false,
		query: '',
		data: [],
	});
	const contractAddr = getContractAddressByName("OlympusNFTMintableToken", networkName);
	const [totalRecords, setTotalrecords] = useState('')
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		_fetchApiCall()
	}, [state.isApiHit]);

	async function _fetchApiCall() {
		if (!state.isApiHit) {
			let res = await UserItemsTransactionsApi();
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
							<h3>Transaction History</h3>
							<div className="table">
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>Date</th>
											<th>Type</th>
											<th>From Addr</th>
											<th>To Addr</th>
											<th>Transaction Hash</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{state.data && Object.keys(state.data).length > 0 ? state.data.map((item, index) => {
											return <tr key={index}>
												<td>{item.createdAt}</td>
												<td>{item.type}</td>
												<td>
													<a target="_blank" href={`${explorerNetworkURL}address/${item.fromAddress}`}>{item.fromAddress.substring(0, 15)}...</a>
												</td>

												<td><a target="_blank" href={`${explorerNetworkURL}address/${contractAddr}`}>{contractAddr.substring(0, 15)}...</a>
												</td>

												<td>{item.transactionHash ?
													<a target="_blank" href={`${explorerNetworkURL}tx/${item.transactionHash}`}>{item.transactionHash.substring(0, 15)}...</a> : '...'}</td>
												<td><span className=" text-success">{item.transactionStatus}</span></td>
											</tr>

										}) : <h4 className="no-content-class">No Item Available</h4>}

									</tbody>
								</table>
							</div>

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
export default History;
