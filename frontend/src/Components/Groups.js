import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";

function MyGroups() {
  const [data, setData] = useState([]);

  const handleCreateGroup = () => {
    window.location.pathname = "/CreateGroup";
  };

  const handleViewGroup = () => {
    window.location.pathname = "/ViewGroup";
  };

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  async function getMyGroups() {
    const response = await fetch(`http://127.0.0.1:5000/groups/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": sessionStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  useEffect(() => {
    getMyGroups();
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
              <a onClick={handleCreateGroup}> Create Group </a>
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

      <h1 className="posts heading">My Groups</h1>
      <div className="feed">
        {data.map((d) => (
          <div className="card posts">
            <label className="post-text">{d.name}</label>
            <label className="show-comment" onClick={"to be added"}>
              View Group
            </label>
            {/* <label className="post-text">{d.id}</label> */}
            <button> Delete Group </button>
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

export default MyGroups;
