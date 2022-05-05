import "./CSS/Home.css";
import React from "react";
import moment from 'moment';
import ShowMap from './ShowMap';

const Post = (post) => {
    const handleComments = (id) => {
        window.location.pathname = `/comments/${id}`;
      };
  return (
    <div className="card posts">
      <h3 className="post">{"@" + post["user.username"]}</h3>
      <label className="post-text">{post.text}</label>
      <label>
        {moment(post.date).format("hh:mm A") +
          " - " +
          moment(post.date).format("DD/MM")}
      </label>
      <label className="show-comment" onClick={() => handleComments(post.id)}>
        Show Comments
      </label>
      <label className="post-text">
        {post.latitude} {post.longitude}
      </label>
      {/* <ShowMap lat={post.latitude} lng={post.longitude}></ShowMap> */}
    </div>
  );
};

export default Post;
