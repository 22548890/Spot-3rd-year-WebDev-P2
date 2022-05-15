import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";
import logo from "../SPOT.svg";

function Explore() {
  const [data, setData] = useState([]);

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroup = () => {
    window.location.pathname = "/Groups";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  async function getAllGroups() {
    const response = await fetch(`http://127.0.0.1:5000/groups/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    setData(await response.json());
    return;
  }

  useEffect(() => {
    getAllGroups();
  }, []);

  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo" onClick={handleHome}>
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
              <a onClick={handleFriends}> Friends</a>
            </li>
            <li>
              <a onClick={handleViewGroup}> Groups</a>
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

      <div className="card_groups">
        <thead>
          <input type="text" placeholder="Search Groups..." />
        </thead>
      </div>

      <h1 className="posts heading">All Groups</h1>
      {data.length == 0 ? (
        <div className="card posts feed">
          <label>There are no groups to show</label>
        </div>
      ) : (
        <div className="feed">
          {data.map((d) => (
            <div className="card posts">
              <label className="post-text">{d.name}</label>
              <label className="show-comment" onClick={handleViewGroup}>
                View Group
              </label>
              {/* <label className="post-text">{d.id}</label> */}
              {/* <button> Join Group </button> */}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Explore;
