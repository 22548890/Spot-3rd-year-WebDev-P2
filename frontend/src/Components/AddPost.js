import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {FaLocationArrow} from "react-icons/fa";

const AddPost = () => {
  const [group_name, setGroupName] = useState("");
  const [category, setCat] = useState("");
  const [text, setText] = useState("");
  const [latitude, setLat] = useState("");
  const [longitude, setLon] = useState("");
  const [video_url, setVid] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert("Please include a post description");
      return;
    }

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        'group_name': "Jews", //group_name
        'category': category,
        'text': text,
        'video_url': video_url,
        'longitude': longitude,
        'latitude': latitude
      }),
    };
    fetch("http://127.0.0.1:5000/post", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    window.location.reload();

    setGroupName("Jews");
    setCat("");
    setText("");
    setLat("");
    setLon("");
    setVid("X");
  };

  return (
    <div className="card posts feed">
      {/* <label>{sessionStorage.getItem('token')}</label> */}
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label className="post">Post:</label>
          <input
            className="post"
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Category:</label>
          <span> </span>
          <select
            className="comConSelect"
            required
            value={category}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value={"None"} hidden>
              Select Category
            </option>
            <option value={"Sport"}>Sport</option>
            <option value={"Education"}>Education</option>
            <option value={"Movies"}>Movies</option>
            <option value={"Cars"}>Cars</option>
          </select>
        </div>
        <div className="form-control">
          <label className="post">Video URL:</label>
          <input
            className="post"
            type="text"
            placeholder="Type video URL"
            onChange={(e) => setVid(e.target.value)}
          />
        </div>
        <div> 
          <FaLocationArrow
            className="icon-show"
            onClick={() => {
              if (!('geolocation' in navigator)) {
                console.log("test");
                setLat(0.0);
                setLon(0.0);
              } else {
                navigator.geolocation.getCurrentPosition((position) => {
                  setLat(position.coords.latitude);
                  setLon(position.coords.longitude);
                });
                
              }
            }}
          />
        </div>
        <button
          className="post"
          onClick={() => {
            onSubmit();
          }}
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
