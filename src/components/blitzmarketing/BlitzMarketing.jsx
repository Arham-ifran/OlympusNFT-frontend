import React, { useState, useEffect } from 'react';
import Image from './../../assets/img/getting-started.png';
import { getCmsDetailPagesApi } from './../../container/Api/api';
import { Link } from 'react-router-dom';

const $ = window.jQuery
const BlitzMarketing = (props) => {
  $(window).scrollTop('0');
  const [pageData, setPageData] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    _fetchData()
  }, [props]);

  async function _fetchData() {
    let res = await getCmsDetailPagesApi(props.match.params.pageName);
    if (res.data.status === 1) {
      let data = { ...res.data.data };
      setPageData(data);

      setLoading(false);
    } else if (res.data.status === 0) {
      setPageData({});
      setLoading(false);
    }
  }

  return (

    <>
      <div className="main-wrapper content-page">
        <div className="page-title-section">
          <h1>{pageData && pageData.title ? pageData.title : 'BLITZ MARKETING'}</h1>
        </div>
        <div className="container">
          <div className="mt-3 breadcrumb">
            <div className="breadcrumb-item"><Link to='/'>Home</Link></div>
            <div className="breadcrumb-item active" aria-current="page">BLITZ MARKETING</div>
          </div>
        </div>
        <section className="getting-started">
          <div className="container">
            <div className="row">
              <div className="col-md-7 d-flex align-items-center">
                <div className="content">
                  <p>{pageData && pageData.description ? pageData.description : 'Lorem ipsum dolar sit '}</p>
                </div>
              </div>
              <div className="col-md-5">
                <div className="image">
                  <img src={Image} alt="Getting Started with NFTs" className="bounce img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
export default BlitzMarketing;