import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

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
  //test

  async function getGroup() {
    const response = await fetch(
      `http://127.0.0.1:5000/users/group=${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("token"),
        },
      }
    );
    setUsers(await response.json());
    return;
  }

  const handleDelete = (groupName) => {
    const requestOpt = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: groupName,
      }),
    };
    async function fetchFunc() {
      return await fetch(`http://127.0.0.1:5000/group/delete`, requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      await fetchFunc();
    })();
    alert("Deleted " + groupName + " group");
    window.location.reload();
  };

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
    getGroup();
  }, []);

  var str = "" + window.location.pathname;
    var groupId = str.substring(str.lastIndexOf("/") + 1, str.length);
    console.log(groupId);

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
                Logout{" "}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
          {data.map((d) => (
              <div className="card feed">
              {(groupId == d.id) ? (
                  <div className="groups">
                  <label className="post-text">{d.name}</label>
                  <button onClick={() => handleDelete(d.name)}>
                    {" "}
                    Delete Group{" "}
                  </button>
                </div>
              ) : (
                  <label></label>
              )}
              
            
            </div>
          ))}
        
    </>
  );
};

export default ShowGroup;
