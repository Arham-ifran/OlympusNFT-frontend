import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Loader from '../loader/Loader';

function Stores(props) {
  const [storeData, setStoreData] = useState([])
  const [loading, setLoaing] = useState(true)

  useEffect(() => {
    if (props.storeData && props.storeData.length > 0) {
      let data = props.storeData;
      setStoreData(data)
      setLoaing(false)
    }
  }, [props.storeData])

   return (
    <>
      <div className='content-box'>
        <h3>Stores</h3>
        {storeData.length < 1 ? <div className='content'>
          <h5>Seller does not have any stores</h5>
        </div> : ''}
        {storeData.length > 0 ? <div className='collection-items product-grid'>
          {storeData && storeData.length > 0 ? storeData.map((item, index) => {
            return <div className='product-item' key={index}>
              <a>
                <div className='product-wrap'>
                  <div className='image'>
                    <img src={item.image} alt='' className='img-fluid' />
                  </div>
                  <div className='product-info'>
                    <Link to={{ pathname: `/store-detail/${item.id}` }}>
                      <h6 className='title'>{item.store_title}</h6>
                    </Link>
                    <p>{item.sub_title.substring(0, 30)}</p>
                    <div className='seller-info'>
                      <div className='item'>
                        <span className='title'>Category:</span>
                        <span className='value'>{item.category}</span>
                      </div>
                      <div className='item'>
                        <span className='title'>Store:</span>
                        <span className='value'>{item.store_title} <b>({item.total_items} items)</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          }) : ''}

        </div>
          : ''}
      </div>
    </>
  )
}
const mapStateToProps = state => {
  return {
    data: state.userReducer.userData,
    loading: state.userReducer.loading,
  }
}
export default connect(mapStateToProps)(withRouter(Stores))