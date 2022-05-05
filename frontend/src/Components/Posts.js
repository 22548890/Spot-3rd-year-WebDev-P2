import "./CSS/Home.css";
import Post from "./Post";
import React from "react";
import moment from 'moment';
import ShowMap from './ShowMap';

const Posts = ({ data }) => {
    const handleComments = (id) => {
        window.location.pathname = `/comments/${id}`;
      };
  return (
    <>
      {/* <h1 className="posts heading">Feed:</h1>
      <div className="feed">
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div> */}
    
    <h1 className="posts heading">Feed:</h1>
    <div className="feed">
      {data.map((d) => (
        <div className="card posts">
          <h3 className="post">{"@" + d["user.username"]}</h3>
          <label className="post-text">{d.text}</label>
          <label>{moment(d.date).format('hh:mm A') + " - " + moment(d.date).format("DD/MM")}</label>
          <label className="show-comment" onClick={() => handleComments(d.id)}>Show Comments</label>
          <label className="post-text">{d.latitude}  {d.longitude}</label>
          <ShowMap lat = {d.latitude} lng = {d.longitude} ></ShowMap>
        </div>
      ))}
    </div>
    </>
  );
};

export default Posts;
