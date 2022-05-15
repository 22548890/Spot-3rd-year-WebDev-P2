import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

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
  const handleChange = () => {
    let search = document.querySelector('input').value;
    // if (search === '') {
    //     search = '%';
    // } 
    // fetch(`http://127.0.0.1:5000/searchCompany/${search}/date/DSC`, {
    // 'method': 'GET',
    // headers: { 'Content-Type': 'application/json' }
    // })
    // .then(response => response.json())
    // .then(response => setData(response))
    // .catch(error => console.log(error));
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
                <td>
                  <button className="follow"
                    onClick={() => {
                      removeFriend(f.id);
                    }}
                  >unfollow</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="users users2 users3">
        <h3>Other Users</h3>
        <input type="search" 
        className="friendsSearch"
        placeholder="Search User..." 
        onInput={()=>handleChange()}/>
        <table>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="show-comment"
                onClick={() => {
                  
                }}
                >{u.username}</td>
                
                <td>
                  <button className="follow"
                    onClick={() => {
                      addFriend(u.id);
                    }}
                  >Follow</button>
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
