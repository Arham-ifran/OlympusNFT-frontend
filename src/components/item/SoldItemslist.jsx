import React, { useState, useEffect } from "react";
import TransferModal from "../modals/TransferModal";
import CreateItemModal from "../modals/CreateItemModal";
import ProfileSideBar from "../profile/ProfileSideBar";
import { Redirect, withRouter, Link } from "react-router-dom";
import { UserSoldItemsListApi, SearchUserSoldItemsListApi, PaginatedUserSoldItemsListApi } from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import Logo from './../../assets/img/olympusnft-logo.gif'
import { usdSymbol, ethSymbol } from '../../constant/constant'
const $ = window.jQuery;
function SoldItemslist() {
	$(window).scrollTop('0');
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [editItemData, setEditItemData] = useState([]);
	const [redirect, setRedirect] = useState(false);
	const [itemsData, setItemsData] = useState([]);
	const [totalRecords, setTotalrecords] = useState('')
	const [loading, setLoading] = useState(true);
	const [id, setId] = useState("");
	const [currentPage, setCurrentPage] = useState(1)
	const [searchVal, setSearchVal] = useState('')
	const [reset, setReset] = useState(false)

	useEffect(() => {
		_fetchSold()
	}, [reset]);

	async function _fetchSold() {
		let res = await UserSoldItemsListApi();
		try {
			if (res && res.data && res.data.status === 1) {
				setItemsData(res.data.data);
				setLoading(false);
				setTotalrecords(res.data.total_records)
			} else if (res && res.data && res.data.status === 0) {
				setEditItemData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}

	const handleCreateItemModal = () => {
		setOpen((x) => !x);
		setShow(false);
	};

	const handleDisplayPortion = () => {
		setShow(true);
	};

	const handleChange = (e) => {
		setSearchVal(e.target.value)
	}

	const handleSearchRequest = async (e) => {
		e.preventDefault()
		setLoading(true)
		let res = await SearchUserSoldItemsListApi(searchVal);
		try {
			if (res && res.data && res.data.status === 1) {
				let data = res.data.data;
				setItemsData(data);
				setLoading(false);
			} else if (res && res.data && res.data.status === 0) {
				setItemsData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}

	const handleReset = () => {
		setSearchVal('')
		setReset(x => !x)
	}

	const handleChangeCount = async (value) => {
		setCurrentPage(value)
		setLoading(true)
		let res = await PaginatedUserSoldItemsListApi(value - 1);
		try {
			if (res && res.data && res.data.status === 1) {
				let data = res.data.data;
				setItemsData(data);
				setLoading(false);
				setTotalrecords(res.data.total_records)
			} else if (res && res.data && res.data.status === 0) {
				setItemsData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}

	if (redirect) {
		return <Redirect to={{
			pathname: `/edit-item/${id}`,
			state: { data: editItemData, loading, id }
		}} />
	} else if (loading) {
		return <Loader />
	} return (
		<>
			<div className="dashboard-wrapper main-padding current-item">
				<div className="row">
					<ProfileSideBar />
					<div className="col-lg-9 col-md-8">
						<div className="content-wrapper">
							<div className="content-box">
								<h2 className="mb-4">Sold Items</h2>
								{itemsData.length < 1 ? <div className='content'>
									<h5>You have no <b>{searchVal}</b> Product</h5>
									<p>You need to create a product to start selling</p>
									<button className="btn-default upgrade hvr-bounce-in" onClick={handleReset}>
										Back
									</button>
								</div> : ''}
								{itemsData.length > 0 ? <div className="search-bar">
									<form>
										<div className="search">
											<div className="form-group">
												<span className="icon fa fa-search" onClick={handleSearchRequest} />
												<input type="text" value={searchVal} onChange={handleChange}
													name="search" className="form-control" placeholder="Search for sold item" />
											</div>
										</div>
									</form>
								</div> : ''}

								<div className="table">
									<table className="table table-bordered">
										<thead>
											<tr>
												<th>OrderId</th>
												<th>Item info</th>
												<th>Status</th>
												<th>Price</th>
												<th>Buyer</th>
												<th>Token Id</th>
												<th>Sold On</th>
											</tr>
										</thead>
										<tbody>
											{itemsData && itemsData.length > 0 ? itemsData.map((item, index) => {

												return <tr>
													<td><Link to={{ pathname: `/product-detail/${item.slug}/${item.productId}` }}>{item.orderId}</Link></td>
													<td>{item.productTitle}</td>
													<td> {item.status}</td>
													<td>{usdSymbol} {item.total}</td>
													<td><Link to={`/user/${item.buyer}`}>{item.buyer}</Link></td>
													<td>{item.tokenId}</td>
													<td>{item.createdAt}</td>
													{/* <td>
                                                        
                                                    </td> */}
												</tr>
											}) : <tr></tr>}


										</tbody>
									</table>
								</div>
								{/*Pagination commented  */}
								<div className="collection-pagenation">
									{itemsData.length > 10 ? <Pagination
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
			</div>
			<CreateItemModal Open={open} Display={show} handleModal={handleCreateItemModal} handleDisplay={handleDisplayPortion} />
			<TransferModal />
		</>
	)
}
export default withRouter(SoldItemslist);