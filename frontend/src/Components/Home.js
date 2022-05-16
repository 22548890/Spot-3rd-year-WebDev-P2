import "./CSS/Home.css";
import logo from "../SPOT.svg";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddPost from "./AddPost";
import ShowMap from "./ShowMap";
import BigMap from "./BigMap";
import Posts from "./Posts";

function Home() {

  
////////////////////////////////
    const [data, setData] = useState([]);
    async function getPostsFiltered(group, user, type, sort) {
    if (user === "") {
      user = "%";
    }
    if (group === "") {
      group = "%";
    }
    if (type === "") {
      type = "date";
    }
    if (sort === "") {
      sort = "dsc";
    }
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${group}&user=${user}&orderby=${type}&order=${sort}`, {//type=location || date
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }
  const handleSearchGroup = () => {
    let sGroup = document.getElementById("searchGroup").value;
    let sUser = document.getElementById("searchUser").value;
    let sortValue = document.getElementById("sortValue").value;
    let orderValue = "";
    if (sortValue === "location") {
      sortValue = "";
      orderValue = "location";
    } else {
      orderValue = "date";
    }

    if (sGroup === '') {
      sGroup = '%';
    }
    if (sUser === '') {
      sUser = '%';
    }
    getPostsFiltered(sGroup, sUser, orderValue, sortValue);
  }


 //////////////////////////// 
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

  return (
    <>
<div className="container">
      <div class="center">
        {/* <div class="header"> */}
        <AddPost></AddPost>
        <Posts></Posts>
        {/* </div> */}
        
      </div>

      <div className="left-side">
      <div className="logo">
            <img
              src={logo}
              className="logoNav"
              alt="Test"
              height="75"
              width="75"
            />
          </div>
            <button onClick={handleViewProfile}> Profile</button> 
            <button onClick={handleFriends}> Friends</button>
            <button onClick={handleViewGroups}> Groups</button>
            <BigMap></BigMap>
            <button className="styleBtn" onClick={handleLogout}>
              Logout{" "}
            </button>

      </div>
      <div className="right-side">
        <div className="filter">
          <input type="search"
            id="searchGroup"
            placeholder="Search Group..."
            onInput={() => handleSearchGroup()} />
        </div>
        <div className="filter">
          <input type="search"
            id="searchUser"
            placeholder="Search User..."
            onInput={() => handleSearchGroup()} />
        </div>
        <button onClick={handleViewExplore}> Explore</button>
      </div>
        
      </div>
    </>
  );
}

export default Home;
