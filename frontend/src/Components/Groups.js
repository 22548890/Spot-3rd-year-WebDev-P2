import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";

function MyGroups() {
  const [data, setData] = useState([]);
  const [dataAllGroups, setDataAllGroups] = useState([]);
  // const [group_name, setGroupName] = useState("");

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

  const handleDelete = (groupName) => { 
    const requestOpt = {
      method: "DELETE",
      headers: { "Content-Type": "application/json","access-token": localStorage.getItem("token") },
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
    alert("Deleted "+groupName+" group");
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

  async function getAllGroups() {
    const response = await fetch(`http://127.0.0.1:5000/groups/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setDataAllGroups(await response.json());
    return;
  }

  async function joinGroup(name) {
    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: name,
      }),
    };
    fetch("http://127.0.0.1:5000/group/join", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));
      window.location.reload();
    return;
  }

  useEffect(() => {
    getMyGroups();
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
      <div className="card feed">
        {data.map((d) => (
          <div className="groups">
            <label className="post-text">{d.name}</label>
            <label className="show-comment" onClick={"to be added"}>
              View Group
            </label>
            {/* <label className="post-text">{d.id}</label> */}
            <button onClick={()=>handleDelete(d.name)}> Delete Group </button>
          </div>
        ))}
      </div>

      <h1 className="posts heading">All Groups</h1>
      <div className="feed card">
        {dataAllGroups.map((d) => (
          <div className="groups">
            <label className="post-text">{d.name}</label>
            <label className="show-comment" onClick={"to be added"}>
              View Group
            </label>
            {/* <label className="post-text">{d.id}</label> */}
            <button onClick={()=>joinGroup(d.name)}> Join Group </button>
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
