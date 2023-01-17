import React, { Component } from 'react';
import { Link } from "react-router-dom";
import VideoImageThumbnail from "react-video-thumbnail-image";

export default function Item({
  Image,
  Logo,
  Title,
  Store,
  id,
  slug,
  price,
  mediaType,
}) {
  return (
    <>
      <div className="image">
        {mediaType.fileType.includes("image") ? (
          <img src={Image} alt={Title} className="img-fluid" />
        ) : (
          <VideoImageThumbnail
            snapshotAtTime={0}
            videoUrl={Image}
            className="img-fluid"
            alt={Title}
          />
        )}
      </div>

      <div className="content inner_det ">
        <div className="detail d-flex flex-column mt-2">
          <div className="d-flex">
            <h5>{Title}</h5>
          </div>
          <div className="d-flex">
            <p className="head">{Store}</p>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="d-flex flex-fill">
            <span className="head">${price}</span>
          </div>
          <div className="d-flex button-holder mt-2 ml-2">
            <Link
              to={{ pathname: `/product-detail/${slug}/${id}` }}
              className="btn"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
