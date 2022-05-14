import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  function addFriend(id) {
    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id : id,
      }),
    };
    fetch("http://127.0.0.1:5000/friend/add", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

      setTimeout(function(){ window.location.reload()}, 10);
    ;
  }

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleViewExplore = () => {
    window.location.pathname = "/Explore";
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

  async function getMyFriends() {
    const response = await fetch(`http://127.0.0.1:5000/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setFriends(await response.json());
    return;
  }

  useEffect(() => {
    getMyFriends();
  }, []);

  async function getUsers() {
    const response = await fetch(`http://127.0.0.1:5000/non-friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setUsers(await response.json());
    return;
  }

  useEffect(() => {
    getUsers();
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
      <div className="friends friends2 friends3">
        <h3>Friends</h3>
        <table>
          <tbody>
            {friends.map((f) => (
              <tr key={f.id}>
                <td>{f.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="users users2 users3">
        <h3>Other Users</h3>
        <input
            className="post"
            type="text"
            placeholder="Seach name"
          />
        <table>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>
                  <FaUserPlus onClick={() => {
                    addFriend(u.id)
                  }
                    }></FaUserPlus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Friends;
