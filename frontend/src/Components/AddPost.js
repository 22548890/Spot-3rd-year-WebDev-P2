import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddPost = () => {
  const [data, setData] = useState([]);
  const [group_name, setGroupName] = useState("");
  const [category, setCat] = useState("");
  const [text, setText] = useState("");
  const [latitude, setLat] = useState(null);
  const [longitude, setLon] = useState(null);
  const [video_url, setVid] = useState("");
  const [isDuplicate, setDuplicate] = useState(false);

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  function setHashtags(hashtag) {
    setDuplicate(false);
    const ht = hashtag.split("#");
    const hash = [];
    for (let i = 0; i < ht.length; i++) {
      if (i !== ht.length - 1) {
        hash[i] = "#" + ht[i + 1];
      }
    }
    setCat(hash);
    for (let i = 0; i < ht.length; i++) {
      for (let j = i + 1; j < ht.length; j++) {
        if (hash[i] === hash[j]) setDuplicate(true);
      }
    }
  }

  async function getMyGroups() {
    const response = await fetch(`http://127.0.0.1:5000/groups/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  useEffect(() => {
    getMyGroups();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      Swal.fire("Please include a post description", "Try again!", "warning");
      return;
    }
    if (latitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          latitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate latitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (longitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          longitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate longitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (/\s/g.test(category)) {
      Swal.fire(
        "Please do not include spaces with hashtags",
        "Try again!",
        "warning"
      );
      return;
    }
    if (
      !/(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])/.test(
        category
      )
    ) {
      Swal.fire("Please include at least 3 hashtags", "Try again!", "warning");
      return;
    }
    if (isDuplicate) {
      Swal.fire("Please include UNIQUE hashtags", "Try again!", "warning");
      return;
    }
    if (group_name === "") {
      Swal.fire("Please select a group", "Try again!", "warning");
      return;
    }

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: group_name,
        hashtags: category,
        text: text,
        video_url: video_url,
        longitude: longitude,
        latitude: latitude,
      }),
    };
    fetch("http://127.0.0.1:5000/post", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    window.location.reload();

    setGroupName("");
    setCat("");
    setText("");
    setLon("");
    setLat("");
    setVid("");
  };


  return (
    <div className="header">
      {/* <label>{sessionStorage.getItem('token')}</label> */}
      <form className="add-form" onSubmit={onSubmit}>
        <div>
          <label className="post">Post:</label>
          <div>
            <textarea
            // className="post"
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setText(e.target.value)}
            />
          </div>  
        </div>


        <div className="post-elements">
          <input
            className="hashtags"
            type="text"
            placeholder="#Hashtags#atleast#3"
            onChange={(e) => setHashtags(e.target.value)}
          />
          
          <label className="vid">
            <input
              type="file"
              className="video-file"
              onChange={(e) => setVid(e.target.value)}
            />
            <text>Upload video</text>
          </label>

          
          <select
            className="tab"
            required
            value={group_name}
            onChange={(e) => setGroupName(e.target.value)}
          >
            <option value={category} hidden>
              Select group
            </option>
            {data.map((d) => (
              <option value={d.name}>{d.name}</option>
            ))}
          </select> 
        </div>

        
        <div className="post-elements2">
          <label className="location-man">Share Location(Manually):</label>
          <input
            // className="post"
            className="latitude"
            type="text"
            placeholder="latitude"
            onChange={(e) => setLat(e.target.value)}
          />
          {/* <br></br> */}
          <input
            className="longitude"
            type="text"
            placeholder="longitude"
            onChange={(e) => setLon(e.target.value)}
          />
        </div>
        <div  className="post-elements2">
          
          {/* <div className="beans"> */}
          <div className="radio-btn">
            {/* <label className="radio-text" for="radio-location"></label> */}
            Share Location(Automatic):
            <input
            type="radio"
            name="location"
            className="auto-radio"
            id="radion-location"
            onChange={() => {
              setLocation();
            }}
          />
          </div>
          
          
          {/* </div>        */}
          <div className="post-btn-div">
            <button
              className="post-btn"
              onClick={() => {
                onSubmit();
              }}>
              Post
            </button>
          </div>
        
        </div>
        
      </form>
    </div>
  );
};

export default AddPost;
