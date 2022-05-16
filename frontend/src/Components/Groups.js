import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";
import logo from "../SPOT.svg";

function MyGroups() {
  const [data, setData] = useState([]);
  const [dataAllGroups, setDataAllGroups] = useState([]);
  // const [dataAdmin, setAdmin] = useState([]);
  // const [group_name, setGroupName] = useState("");
  const admin = false;

  const handleCreateGroup = () => {
    window.location.pathname = "/CreateGroup";
  };

  const handleViewGroup = () => {
    window.location.pathname = "/ViewGroup";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleShowGroup = (id) => {
    window.location.pathname = `/ShowGroup/${id}`;
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

  async function getAllGroups() {
    const response = await fetch(`http://127.0.0.1:5000/groups/not-my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setDataAllGroups(await response.json());
    return;
  }

  // async function getAdmin() {
  //   const response = await fetch("", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "access-token": localStorage.getItem("token"),
  //     },
  //   });
  //   setAdmin(await response.json());
  // }

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
      setTimeout(function () {
        window.location.reload();
      }, 20);
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
    getMyGroups();
    getAllGroups();
  }, []);

  return (
    <>

      <div className="container">
        <div className="left-side">
          
                    <button onClick={handleViewProfile}> Profile</button> 
                    <button onClick={handleFriends}> Friends</button>
                    {/* <button onClick={handleViewGroups}> Groups</button> */}
                    <button onClick={handleCreateGroup}> Create Group </button>
                    <button className="styleBtn" onClick={handleHome}>
                      Back{" "}
                    </button>
              </div>
              
              <div className="right-side-groups ">
                <h1>My Groups</h1>
                {data.length === 0 ? (
                <div className="card feed">
                  <label>You are not currently in group</label>
                </div>
              ) : (
                <div className="clear-div">
                  {data.map((d) => (
                    <div className="clear-div">
                      <label className="clear-div">{d.name}</label>
                      <button className="show-comment clear-div" onClick={()=>handleShowGroup(d.id)}>
                        View Members
                      </button>
                      
                      {/* <label className="post-text">{d.id}</label> */}
                      {admin === true ? (
                        // <div clear-div>
                          <button className="clear-div" onClick={() => handleDelete(d.name)}>
                            Delete Group
                          </button>
                        // </div>
                      ) : (
                        <div className="clear-div">{/* <label>Not admin</label> */}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}


                <h1 className="posts heading">All Groups</h1>
                {dataAllGroups.length === 0 ? (
                  <div className="card feed">
                    <label>There are no groups to join</label>
                  </div>
                ) : (
                  <div className="feed card">
                    <input type="search"
                      placeholder="Search Group..."
                      onInput={() => handleChange()} />
                    {dataAllGroups.map((d) => (
                      <div className="groups">
                        <label className="post-text">{d.name}</label>
                        {/* <label className="post-text">{d.id}</label> */}
                        <button onClick={() => joinGroup(d.name)}> Join Group </button>
                      </div>
                    ))}
                  </div>
                )}




              </div>
      </div>
      
      
      


      
    </>
  );
}

export default MyGroups;
