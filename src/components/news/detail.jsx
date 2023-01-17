import React, { useEffect } from 'react';
import { fetchCompleteBlog } from './../../store/actions/blogsAction';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import Loader from '../loader/Loader';

const $ = window.jQuery
const NewsDetail = (props) => {
	$(window).scrollTop('0');
	const fetchBlog = async (blog_name) => {
		await props.dispatch(fetchCompleteBlog(blog_name))
	}
	useEffect(() => {
		if (props.match.params.slug) {
			fetchBlog(props.match.params.slug)
		}
	}, [props.match.params.slug])

	function createMarkup(data) {
		return { __html: data };
	}

	if (props.loading) {
		return <Loader />
	} return (
		<>
			<div className="main-wrapper content-page">
				<div className="page-title-section">
					<h3>{props.blog.title}</h3>
				</div>
				<div className="container">
					<div className="mt-3 breadcrumb">
						<div className="breadcrumb-item"><Link to='/'>Home</Link></div>
						<div className="breadcrumb-item"><Link to={{ pathname: `/blogs/${props.blog.categorySlug}` }}>{props.blog.categoryTitle}</Link></div>
						<div className="breadcrumb-item active" aria-current="page">{props.blog.title}</div>
					</div>
				</div>
				<section className="getting-started">
					<div className="container">
						<div className="row">
							<div className="col-md-7 d-flex align-items-center">
								<div className="content" dangerouslySetInnerHTML={createMarkup(props.blog.description)} />
							</div>
							<div className="col-md-5">
								<div className="image">
									<img src={props.blog.image} alt={props.blog.title} className="img-fluid" />
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
const mapStateToProps = state => {
	return {
		loading: state.blogsReducer.detailBlogLoading,
		blog: state.blogsReducer.detailBlog
	}
}

export default connect(mapStateToProps)(NewsDetail);