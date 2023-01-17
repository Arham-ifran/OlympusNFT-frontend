import React from 'react';
import Cover from './../../assets/img/seller-bg.jpg'
import Photo from './../../assets/img/profile.jpeg'
import { Link } from 'react-router-dom'

export default function MyProfile(profileData) {

  let userId = localStorage.getItem('id')

  return (
    <>
      <div className="content-box">
        <div className="seller-profile-info">
          <div className="bg-cover">
            <img src={profileData.bannerImage ? profileData.bannerImage : Cover} alt={profileData.username} className="img-fluid" />
          </div>
          <div className="seller-detail">

            <div className="profile-image">
              <img src={profileData.profilePhoto ? profileData.profilePhoto : Photo} alt={profileData.username} className="img-fluid" />
            </div>
            <div className="">
              <h3 className="name">{profileData.username}</h3>
              {/* <a href="#">@{username}</a> */}
            </div>
            <div className="message-link">
              {profileData.id !== userId ? <Link to={{ pathname: `/messages/${profileData.username}` }} className="btn-primary hvr-bounce-in"><span className="icon fa fa-envelope-o">
              </span>Message </Link> : <Link to={{ pathname: `/messages` }} className="btn-primary hvr-bounce-in"><span className="icon fa fa-envelope-o">
              </span>Message </Link>}
            </div>
            <div className="total-details">
              <div className="item">
                <h5>Item</h5>
                <span>{profileData.totalItem}</span>
              </div>
              <div className="item">
                <h5>Views </h5>
                <span>{profileData.totalViewed}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
