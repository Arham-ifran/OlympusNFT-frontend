import React, { useState, useEffect } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { UserPublicProfileProductsApi } from "./../../container/Api/api";
import Loader from "../loader/Loader";
import { Link } from 'react-router-dom'
import { ErrorHandler } from './../../utils/message'
import { Pagination } from 'antd';
import { usdSymbol, ethSymbol } from '../../constant/constant'
import { connect } from 'react-redux'
import { EthPriceCalculation } from './../../utils/ethPriceFunction'
import VideoImageThumbnail from 'react-video-thumbnail-image';

function AllItemsList(props) {
	const [editItemData, setEditItemData] = useState([]);
	const [itemsData, setItemsData] = useState([]);
	const [totalRecords, setTotalrecords] = useState('')
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1)
	const [searchVal, setSearchVal] = useState('')
	const [filterName, setFilterName] = useState('')
	const [category, setCategory] = useState('All')
	const [order, setOrder] = useState('Newest')
	const [itemtype, setItemType] = useState('All Items')
	const [ethereum, setEthereum] = useState('')

	const CalculatePrice = async () => {
		let value = await EthPriceCalculation()
		setEthereum(value)
	}

	async function fetchData() {
		let res = await UserPublicProfileProductsApi(props.match.params.username);
		try {
			if (res.data.status === 1) {
				setItemsData(res.data.data);
				setLoading(false);
				setTotalrecords(res.data.total_records)
			} else if (res.data.status === 0) {
				setEditItemData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	};

	useEffect(() => {
		CalculatePrice()
		fetchData()
	}, [])

	const handleChangeCount = async (value) => {
		setCurrentPage(value)
		setLoading(true)
		let body = {};
		body['offset'] = value - 1;
		if (filterName === "music" || filterName === "art" || filterName === "film") {
			body['category'] = filterName;
		} else if (filterName === "newest" || filterName === "oldest" || filterName === "lower" || filterName === "higher") {
			body['order_by'] = filterName;
		} else if (filterName === "all-items" || filterName === "sold-items") {
			body['item_type'] = filterName;
		}
		let res = await UserPublicProfileProductsApi(props.match.params.username, body);
		try {
			if (res.data.status === 1) {
				let data = res.data.data;
				setItemsData(data);
				setLoading(false);
				setTotalrecords(res.data.total_records)
			} else if (res.data.status === 0) {
				setItemsData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}
	const handleSearchRequest = async () => {
		setLoading(true)
		let body = {};
		body['search_product'] = searchVal;
		let res = await UserPublicProfileProductsApi(props.match.params.username, body);
		try {
			if (res.data.status === 1) {
				let data = res.data.data;
				setItemsData(data);
				setLoading(false);
			} else if (res.data.status === 0) {
				setItemsData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}
	const applyFilter = async (type) => {
		setFilterName(type)
		setLoading(true)
		let body = {};
		if (type === "music" || type === "art" || type === "film") {
			body['category'] = type;
			let cpitalize = type.charAt(0).toUpperCase() + type.slice(1)
			setCategory(cpitalize)
		} else if (type === "newest" || type === "oldest" || type === "lower" || type === "higher") {
			body['order_by'] = type;
			let cpitalize = type.charAt(0).toUpperCase() + type.slice(1)
			setOrder(cpitalize)
		} else if (type === "all-items" || type === "sold-items") {
			body['item_type'] = type;
			let cpitalize = type.charAt(0).toUpperCase() + type.slice(1)
			setItemType(cpitalize.replace('-', ' '))
		}
		let res = await UserPublicProfileProductsApi(props.match.params.username, body);
		try {
			if (res.data.status === 1) {
				let data = res.data.data;
				setItemsData(data);
				setLoading(false);
				setTotalrecords(res.data.total_records)
			} else if (res.data.status === 0) {
				setItemsData([]);
				setLoading(false);
			}
		} catch (err) {
			ErrorHandler(err)
		}
	}


	if (loading) {
		return <Loader />
	} return (
		<>
			<div className="content-box">
				<h3>All Listings</h3>

				<div className="search-bar">
					<form>
						<div className="search">
							<div className="form-group">
								<span className="icon fa fa-search" onClick={() => handleSearchRequest()} />
								<input type="text" name="search_product" onChange={(e) => setSearchVal(e.target.value)} className="form-control" placeholder="Search for an item" />
							</div>
						</div>
					</form>
					<div className="filters">
						<div className="dropdown">
							<button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{category}
							</button>
							<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a className="dropdown-item" onClick={() => applyFilter('art')}>Art</a>
								<a className="dropdown-item" onClick={() => applyFilter('music')}>Music</a>
								<a className="dropdown-item" onClick={() => applyFilter('film')}>Flim</a>
							</div>
						</div>
						<div className="dropdown">
							<button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{itemtype}
							</button>
							<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a className="dropdown-item" onClick={() => applyFilter('all-items')}>All Items</a>
								<a className="dropdown-item" onClick={() => applyFilter('sold-items')}>Sold Items</a>
							</div>
						</div>
						<div className="dropdown">
							<button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{order}
							</button>
							<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a className="dropdown-item" onClick={() => applyFilter('newest')}>Newest</a>
								<a className="dropdown-item" onClick={() => applyFilter('oldest')}>Oldest</a>
								<a className="dropdown-item" onClick={() => applyFilter('lower')}>Price -  Low to High</a>
								<a className="dropdown-item" onClick={() => applyFilter('higher')}>Price -  High to low</a>
							</div>
						</div>
					</div>

				</div>
				<div className="collection-items product-grid">
					{itemsData && itemsData.length > 0 ? itemsData.map((item, index) => {
						let mediaType = JSON.parse(item.productMedia);
						return <div className="product-item" key={index}>
							<div className="product-wrap">
								<div className="image">
									{mediaType.fileType.includes('image') ? <img src={item.ipfsImageHash} alt={item.title} className="img-fluid" width="50px" height="50px" /> : <VideoImageThumbnail snapshotAtTime={0}
										videoUrl={item.ipfsImageHash}
										className="img-fluid"
										alt={item.title}
									/>}
								</div>
								<div className="product-info">
									<h6 className="title">{item.productTitle}</h6>
									<p>{item.productSubTitle}</p>
									<div className="seller-info">
										<div className="item">
											<span className="title">Views: </span>
											<a ><span className="value">{item.views ? item.views : 0}</span></a>
										</div>
										<div className="item">
											<span className="title">Store:</span>
											<a><span className="value">{item.store}</span></a>
										</div>
									</div>
									<div className="price-wrapper">
										{
											!props.ethPriceState && item.priceType == "0" ?
												<span className="price priceUsd">{usdSymbol}{item.priceUsd}</span>
												:
												!props.ethPriceState && item.priceType == "1" ?
													<span className="price bidprice">Bid Price: {usdSymbol}{item.bidPriceUsd}</span>
													:
													!props.ethPriceState && item.priceType == "2" ?
														<>
															<span className="price priceUsd">{usdSymbol}{item.priceUsd}</span>
															<span className="price bidprice">Bid Price: {usdSymbol}{item.bidPriceUsd}</span>
														</>

														: props.ethPriceState && item.priceType == "0" ?
															<span className="price priceUsd">{ethSymbol}{(item.priceUsd / ethereum).toFixed(4)}</span>

															: props.ethPriceState && item.priceType == "1" ?
																<span className="price bidprice">Bid Price: {ethSymbol}{(item.bidPriceUsd / ethereum).toFixed(4)}</span>

																: props.ethPriceState && item.priceType == "2" ?
																	<>
																		<span className="price priceUsd">{ethSymbol}{(item.priceUsd / ethereum).toFixed(4)}</span>
																		<span className="price bidprice">Bid Price: {ethSymbol}{(item.bidPriceUsd / ethereum).toFixed(4)}</span>
																	</> : ''
										}
									</div>
								</div>
								<div className="actions">
									<Link to={{ pathname: `/product-detail/${item.slug}/${item.id}` }} data-toggle="modal" data-target=".product" className="btn-default hvr-bounce-in">View Details</Link>
								</div>
							</div>
						</div>
					}) : ""}
				</div>

				{itemsData && itemsData.length > 0 ? <Pagination
					current={currentPage}
					defaultCurrent={currentPage}
					pageSize={12}
					total={totalRecords}
					onChange={handleChangeCount}
				/> : ""}
			</div>
		</>
	)
}
const mapStateToProps = state => {
	return {
		ethPriceState: state.userReducer.ethPriceState,
	}
}
export default connect(mapStateToProps)(withRouter(AllItemsList))
