import React, { useState, useEffect } from 'react';
import Loader from '../loader/Loader';
import Image from './../../assets/img/getting-started.png';
import { getCmsDetailPagesApi } from './../../container/Api/api';
const $ = window.jQuery
const About = (props) => {
  $(window).scrollTop('0');
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let _param = props.match.params.pageName
    _fetchData(_param)
  }, [props]);

 

  async function _fetchData(name) {
    setLoading(true);
    let res = await getCmsDetailPagesApi(name);
    if (res.data.status === 1) {
      let data = { ...res.data.data };
      setPageData(data);
      setLoading(false);
    } else if (res.data.status === 0) {
      setPageData({});
      setLoading(false);
    }
  }

  function createMarkup(data) {
    return { __html: data };
  }

  return (
    <>
     {!loading?<div className="main-wrapper content-page">
        <div className="page-title-section">
          <h1>{pageData && pageData.title ? pageData.title : ''}</h1>
        </div>
        <section className="getting-started">
          <div className="container">
            <div className="row">
              <div className="col-md-7 d-flex align-items-center">
                <div className="content" 
                dangerouslySetInnerHTML={createMarkup(pageData && pageData.description ? pageData.description : '')} />

              </div>
              <div className="col-md-5">
                <div className="image">
                  <img src={Image} alt="Getting Started with NFTs" className="bounce img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div> :<Loader/>} 
    </>
  )
}
export default About;