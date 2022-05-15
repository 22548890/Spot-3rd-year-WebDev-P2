import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";

const ShowGroup = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    window.location.pathname = "/login";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };
  const handleGroup = (e) => {
    e.preventDefault();
    window.location.pathname = "/Groups";
  };

  var str = "" + window.location.pathname;
  var groupId = str.substring(str.lastIndexOf("/") + 1, str.length);
  console.log(groupId);

  async function getGroup() {
    const response = await fetch(`http://127.0.0.1:5000/users/group=${groupId}`, {
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
    getGroup();
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
              <a onClick={handleViewGroups}> Groups</a>
            </li>
            <li>
              <a onClick={handleViewProfile}> Profile</a>
            </li>
            <li>
              <button className="styleBtn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <h1 className="posts heading">Group Members:</h1>
      <div className="card feed">
        {data.map((d) => (
          <>
            <label className="post-text">{d.username}</label>
           
          </>

        ))}
      </div>
      <button className="btn back" onclick={handleGroup}>Back</button>
    </>
  );
};

export default ShowGroup;
