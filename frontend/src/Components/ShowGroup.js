import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";

const ShowGroup = () => {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState([]);
  const [user, setUser] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  function makeAdmin(userId) {
    makeUserAdmin(userId);
  }

  function makeUserAdmin(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_id: groupId,
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/admin/make", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

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

  async function getProfile() {
    const response = await fetch(`http://127.0.0.1:5000/profile/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setUser(await response.json());
    return;
  }

  useEffect(() => {
    getProfile();
  }, []);

  async function getGroupInfo() {
    const response = await fetch(`http://127.0.0.1:5000/group=${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setGroup(await response.json());
    return;
  }

  useEffect(() => {
    getGroupInfo();
  }, []);

  var str = "" + window.location.pathname;
  var groupId = str.substring(str.lastIndexOf("/") + 1, str.length);
  console.log(groupId);

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
      <h1 className="posts heading">{group.name}</h1>
      <div className="card feed">
        <table>
          <tbody>
            {data.map((d) => (
              <>
                <tr key={d.id}>
                  <td>
                    {d.username === user.username ? (
                      <label>{d.username}(You)</label>
                    ) : (
                      <div>
                        {d.admin === 1 ? (
                          <label>{d.username}(Admin)</label>
                        ) : (
                          <label>{d.username}(Member)</label>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {group.admin == 1 ? (
                      <div>
                      {d.username === user.username ? (
                        <label></label>
                      ) : (
                        <div>
                        {d.admin === 1 ? (
                          <label></label>
                        ) : (
                          <button
                          className="follow"
                          onClick={() => {
                            makeAdmin(d.id);
                          }}
                        >
                          Make Admin
                        </button>
                        )}
                        </div>
                      )}
                    </div>
                    ) : (
                      <label></label>
                      
                    )}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      
    </>
  );
};

export default ShowGroup;
