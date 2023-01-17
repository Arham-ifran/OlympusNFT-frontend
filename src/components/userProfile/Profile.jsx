import React, { useEffect, useState } from 'react';
import { UserPublicProfileApi } from './../../container/Api/api';
import MyProfile from './MyProfile'
import { ErrorHandler } from './../../utils/message'
import Stores from './Stores'
import Items from './AllItems'
import Reviews from './Reviews'
import Loader from '../loader/Loader';
import { useHistory } from "react-router-dom";
const $ = window.jQuery;
function Profile(props) {
  $(window).scrollTop('0');
  let history = useHistory();
  const [profileData, setProfileData] = useState([]);
  const [storeData, setStoreData] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    _fetch()
  }, []);

  async function _fetch() {
    let res = await UserPublicProfileApi(props.match.params.username);

    try {
      if (res.data.status === 1) {
        let data = res.data.data;
        setProfileData(data.user);
        setStoreData(data.stores);
        setLoading(false);
      } else if (res.data.status === 0) {
        setProfileData([]);
        setStoreData([]);

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
      <div className='dashboard-wrapper main-padding'>
        <div className='row'>
          <div className='col-lg-12 col-md-12'>
            <div className='content-wrapper'>
              <MyProfile {...profileData} />
              <div className="profile-tabs">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="stores-tab" data-toggle="tab" href="#stores" role="tab" aria-controls="stores" aria-selected="false">Stores</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-controls="reviews" aria-selected="false">Reviews</a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <Items />
                  </div>

                  <div className="tab-pane fade" id="stores" role="tabpanel" aria-labelledby="stores-tab">
                    <Stores storeData={storeData} />
                  </div>
                  <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                    <Reviews {...profileData} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Profile;