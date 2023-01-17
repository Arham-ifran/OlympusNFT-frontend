import React from 'react';
import ProfileSideBar from './ProfileSideBar';
import MyProfile from './MyProfile';
import Stores from './Stores';

const $ = window.jQuery;

function Profile(props) {
  $(window).scrollTop('0');
  return (
    <div className='dashboard-wrapper main-padding'>
      <div className='row'>
        <ProfileSideBar />
        <div className='col-lg-9 col-md-8'>
          <div className='content-wrapper'>
            <MyProfile />
            <Stores />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
