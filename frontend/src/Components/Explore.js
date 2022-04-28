import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";

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
    window.location.pathname = "/ViewGroup";
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
          <div className="logo">
            <label>Spot</label>
          </div>

          <ul id="menu">
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

      <div>
        <button className="btn home" onClick={handleHome}>
          Back Home
        </button>
      </div>
    </>
  );
}

export default Explore;
