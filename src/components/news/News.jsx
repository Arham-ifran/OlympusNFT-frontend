import React, { useEffect, useState } from 'react';
import { fetchBlogNewsData, blogNews } from './../../store/actions/blogsAction'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import Loader from '../loader/Loader';
import { Pagination } from 'antd';

const $ = window.jQuery
const News = (props) => {
  $(window).scrollTop('0');
  const [cat, setCat] = useState('News')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const fetchBlogsData = async (cat, currentPage, search) => {
    await props.dispatch(fetchBlogNewsData(cat, currentPage, search))
  }
  useEffect(() => {
    fetchBlogsData(cat, currentPage)
  }, [cat, currentPage])

  function createMarkup(data) {
    return { __html: data };
  }

  const handleChangeCat = (item) => {
    setCat(item)
    props.dispatch(blogNews())
  }

  const handleChangeCount = (val) => {
    setCurrentPage(val - 1)
  }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  if (props.loading) {
    return <Loader />
  } return (
    <>
      <div className="main-wrapper category">
        <div className="page-title-section">
          <h1>{cat}</h1>
        </div>
        <div className="main-padding">
          <div className="mt-5 breadcrumb">
            <div className="breadcrumb-item"><Link to='/'>Home</Link></div>
            <div className="breadcrumb-item active" aria-current="page"><Link to={{ pathname: `/blogs/${cat}` }}>{cat}</Link></div>
          </div>

          <div className='search-bar'>
            <form>
              <div className='search'>
                <div className='form-group'>
                  <span className='icon fa fa-search' onClick={() => {
                    if (search !== '') {
                      fetchBlogsData(cat, currentPage, search)
                    }
                  }} />
                  <input type='text' name='search_blog' value={search} onChange={handleChange}
                    className='form-control' placeholder='Search blogs by title / description' />
                </div>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="col-lg-8">
              {props.blogs && props.blogs.length > 0 ?
                <div className="collection-main">
                  <div className="news-items ">
                    <div className="row">
                      {props.blogs.map((item, i) => {
                        return <div className="col-md-6" key={i}>
                          <div className="item">
                            <div className="image">
                              <img src={item.image} alt={item.title} className="img-fluid" />
                            </div>
                            <div className="content">
                              <div>{item.title}</div>
                              <Link to={{ pathname: `/blog/${item.slug}` }}>Read more <span className="fa fa-angle-right"></span></Link>
                            </div>
                            <span className="date">{item.createdAt}</span>
                          </div>
                        </div>
                      })}
                    </div>

                  </div>
                  <div className="collection-pagenation">
                    {props.totalRecords > 10 ? <Pagination
                      current={currentPage + 1}
                      defaultCurrent={currentPage}
                      total={props.totalRecords}
                      onChange={handleChangeCount}
                    /> : ''}
                  </div>
                </div> : <div className="alert alert-warning">No post found</div>}
            </div>

            <div className="col-lg-4">
              <div className="collection-sidebar news">
                <div className="filters">
                  {props.recentBlogs && Object.keys(props.recentBlogs).length > 0 ? <div className="item">
                    <h4 className="title mb-0">Recent Posts</h4>
                    <div className="filter-content" >
                      {props.recentBlogs.map((item, i) => {
                        return <ul className="list-menu" key={i}>
                          <li><Link to={{ pathname: `/blog/${item.slug}` }}>{item.title}</Link></li>
                        </ul>
                      })}
                    </div>
                  </div> : ''}
                  {props.blogCategories && Object.keys(props.blogCategories).length > 0 ? <div className="item">
                    <h4 className="title mb-0">Categories</h4>
                    <div className="filter-content" >
                      {props.blogCategories.map((item, i) => {
                        return <ul className="list-menu" key={i}>
                          <li><Link to={{ pathname: `/blogs/${item.slug}` }} onClick={() => handleChangeCat(item.slug)} >{item.title} </Link></li>
                        </ul>
                      })}
                    </div>
                  </div> : ''}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
const mapStateToProps = state => {
  return {
    loading: state.blogsReducer.loading,
    blogs: state.blogsReducer.blogs,
    blogCategories: state.blogsReducer.blogCategories,
    recentBlogs: state.blogsReducer.recentBlogs,
    totalRecords: state.blogsReducer.total_records
  }
}
export default connect(mapStateToProps)(News);