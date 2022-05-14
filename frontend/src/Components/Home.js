import "./CSS/Home.css";
import logo from "../SPOT.svg";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddPost from "./AddPost";
import BigMap from "./BigMap";
import Posts from "./Posts";

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

  const handleViewFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleViewExplore = () => {
    window.location.pathname = "/Explore";
  };

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
              <a onClick={handleViewFriends}> Friends</a>
            </li>
            <li>
              <a onClick={handleViewGroups}> Groups</a>
            </li>
            <li>
              <a onClick={handleViewExplore}> Explore</a>
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
        <AddPost></AddPost>
        <BigMap></BigMap>
        <h1 className="posts heading">Feed:</h1>
        <Posts></Posts>
      </div>
    </>
  );
}

export default Home;
