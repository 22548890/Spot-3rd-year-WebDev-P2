import { useState, useEffect } from "react";
import React from "react";
import Swal from "sweetalert2";
import logo from "../SPOT.svg";

export default function UpdateProfile() {
  const [data, setData] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
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

  const handleDelete = () => {
    const requestOpt = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    };
    async function fetchFunc() {
      return await fetch(`http://127.0.0.1:5000/profile/delete`, requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      await fetchFunc();
    })();
    alert("Deleted Account");
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  const UpdateProfile = (e) => {
    e.preventDefault();
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        avatar_url: document.getElementById("photo-upload").value,
      }),
    };
    async function fetchFunc() {
      return await fetch("http://127.0.0.1:5000/profile/update", requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      let info = await fetchFunc();
      if (info.success) {
        window.location.pathname = "/";
      } else {
        Swal.fire(info.msg, "Try again!", "warning");
      }
    })();
  };

  async function getProfile() {
    const response = await fetch(`http://127.0.0.1:5000/profile/my`, {
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
    getProfile();
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
              <a onClick={"nothing"}> Profile</a>
            </li>
            <li>
              <button className="styleBtn" onClick={handleLogout}>
                Logout{" "}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="card feed">
        <div className="field">
          <h2>My Profile:</h2>
          <img
            htmlFor="photo-upload"
            className="loginimg"
            src={data.avatar_url}
            alt="User Avatar"
          />
          <input
            id="photo-upload"
            className="img-upload"
            type="url"
            placeholder={"Enter URL"}
            defaultValue={data.avatar_url}
          />
          <label>Username:</label>
          <input
            id="username"
            type="username"
            maxLength="25"
            defaultValue={data.username}
            required
          />
          <label>Email:</label>
          <input
            id="email"
            type="email"
            maxLength="25"
            defaultValue={data.email}
            required
          />
          <label>Password:</label>
          <input
            id="password"
            type="password"
            maxLength="25"
            defaultValue={data.password}
            required
          />

          <button className="UpdateBtn" onClick={UpdateProfile}>
            Update Profile
          </button>
          <button className="deleteBtn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
