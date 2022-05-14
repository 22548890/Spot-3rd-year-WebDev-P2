import "./CSS/Home.css";
import logo from "../SPOT.svg";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddPost from "./AddPost";
import ShowMap from "./ShowMap";
import BigMap from "./BigMap";

function Home() {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleViewExplore = () => {
    window.location.pathname = "/Explore";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleComments = (id) => {
    window.location.pathname = `/comments/${id}`;
  };

  const [text, setText] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [category, setCategory] = useState("");
  const [group_name, setGroup_name] = useState("");
  const [data, setData] = useState([]);
  const [onceOff, setOnceOff] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: group_name,
        category: category,
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
  };

  async function getPosts() {
    const response = await fetch(`http://127.0.0.1:5000/feed/main`, {
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
    getPosts();
  }, []);

  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <img
              src={logo}
              className="logoNav"
              alt="Test"
              height="75"
              width="75"
            />
          </div>

          <ul id="menu">
          <li>
              <a onClick={handleViewExplore}> Explore</a>
            </li>
            <li>
              <a onClick={handleFriends}> Friends</a>
            </li>
            <li>
              <a onClick={handleViewGroups}> Groups</a>
            </li>
            <li>
              <a onClick={handleViewProfile}> Profile</a>
            </li>
            <li>
              <button className="styleBtn" onClick={handleLogout}>
                Logout{" "}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div>
        {/* <div className="card posts feed">
          {/* <label>{sessionStorage.getItem('token')}</label> }
          <label className="post">Post: </label>
          <input
            className="post"
            type="text"
            placeholder="type a post message..."
            onChange={(e) => setText(e.target.value)}
          />
          <button className="post" onClick={onSubmit}>
            POST
          </button>
        </div> */}
        <AddPost></AddPost>
        <BigMap></BigMap>
        <h1 className="posts heading">Feed:</h1>
        <div className="feed">
          {data.map((d) => (
            <div className="card posts">
              <h3 className="post">{"@" + d["user.username"]}</h3>
              <label className="post-text">{d.text}</label>
              <label>
                {moment(d.date).format("hh:mm A") +
                  " - " +
                  moment(d.date).format("DD/MM")}
              </label>
              <label
                className="show-comment"
                onClick={() => handleComments(d.id)}
              >
                Show Comments
              </label>
              {(d.latitude == null) ? (
                <label></label>
              ) : (
                <ShowMap lat = {d.latitude} lng = {d.longitude} ></ShowMap>
              )}

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
