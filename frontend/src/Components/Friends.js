import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  function addFriend(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/friend/add", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

  function removeFriend(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/friend/remove", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    window.location.pathname = "/login";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  async function getPostsFilteredFriends(user) {
    if (user === "") {
      user = "%";
    }
    const response = await fetch(`http://127.0.0.1:5000/friends/user=${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setFriends(await response.json());
    return;
  }

  const handleSearchFriends = () => {
    let sUser = document.getElementById("searchFriendUser").value;
    if (sUser === "") {
      sUser = "%";
    }
    getPostsFilteredFriends(sUser);
  };

  async function getPostsFilteredNonFriends(user) {
    if (user === "") {
      user = "%";
    }
    const response = await fetch(
      `http://127.0.0.1:5000/non-friends/user=${user}`,
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

  const handleSearchNonFriends = () => {
    let sUser = document.getElementById("searchNonFriendUser").value;
    if (sUser === "") {
      sUser = "%";
    }
    getPostsFilteredNonFriends(sUser);
  };

  useEffect(() => {
    getPostsFilteredFriends("%");
  }, []);

  useEffect(() => {
    getPostsFilteredNonFriends("%");
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
              <a > Friends</a>
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
      <div className="friends friends2 friends3">
        <h3>Friends</h3>
        <input
          type="search"
          id="searchFriendUser"
          className="friendsSearch"
          placeholder="Search User..."
          onInput={() => handleSearchFriends()}
        />
        <table>
          <tbody>
            {friends.length === 0 ? (
              <label className="post feed">No users to display</label>
            ) : (
              <>
                {friends.map((f) => (
                  <tr key={f.id}>
                    <td>{f.username}</td>
                    <td>
                      <button
                        className="follow"
                        onClick={() => {
                          removeFriend(f.id);
                        }}
                      >
                        unfollow
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="users users2 users3">
        <h3>Other Users</h3>
        <input
          type="search"
          id="searchNonFriendUser"
          className="friendsSearch"
          placeholder="Search User..."
          onInput={() => handleSearchNonFriends()}
        />
        <table>
          <tbody>
            {users.length === 0 ? (
              <label className="post feed">No users to display</label>
            ) : (
              <>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>

                    <td>
                      <button
                        className="follow"
                        onClick={() => {
                          addFriend(u.id);
                        }}
                      >
                        Follow
                      </button>
                    </td>
                  </tr>
                ))}
                <button className="styleBtn" onClick={handleHome}>
                  Back{" "}
                </button>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Friends;
