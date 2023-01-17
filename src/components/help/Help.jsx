import React, { useState, useEffect } from 'react';
import Image from './../../assets/img/getting-started.png';
import Loader from './../loader/Loader';
import { getFaQsApi } from '../../container/Api/api'
const $ = window.jQuery
const Help = (props) => {
	$(window).scrollTop('0');
	const [rfqsData, setRFQsData] = useState([])
	const [loading, setLoaing] = useState(true)

	useEffect(() => {
		_fetchData()
	}, []);

	async function _fetchData() {
		let res = await getFaQsApi()
		if (res.status === 200) {
			let data = res.data.data;
			setRFQsData(data)
			setLoaing(false)
		} else if (res.data.status === 0) {
			setRFQsData([])
		}
	}

	if (loading) {
		return <Loader />
	}
	return (
		<div className="main-wrapper content-page">
			<div className="page-title-section">
				<h1>Help</h1>
			</div>
			<section className="faqs">
				<div className="container">
					<div className="row">
						{
							rfqsData && rfqsData.length > 0 ?
								rfqsData.map((item, index) => {
									if (item.faqs.length > 0)
										return <RFQs index={index} data={item} key={index} />
								}) : ''
						}
					</div>
				</div>
			</section>
		</div>
	)
}
const RFQs = (props) => {
	return <div key={props.index} className="col-md-12">
		<div className="content">
			<h2>{props.data.categoryTitle}</h2>
			{props.data.faqs.map((subItem, subIndex) => {
				return <div key={subIndex} className="question-answer">
					<div className="item">
						<h4 className="title">
							<a data-toggle="collapse" data-target="#collapse_aside1" data-abc="true" aria-expanded="false">
								{subItem.title}
								<span className="icon fas plus-minus" />
							</a>
						</h4>
						<div className="content-answer collapse show" id="collapse_aside1">
							<p>{subItem.description}</p>
						</div>
					</div>
				</div>
			})}

		</div>
	</div>
}
export default Help;