import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactPlayer from 'react-player';

const Posts = () => {
  const [data, setData] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [sort, setSort] = useState("");
  const [orderby, setOrderby] = useState("date");
  const [order, setOrder] = useState("dsc");
  const [searchUser, setSearchUser] = useState("%");
  const [searchGroup, setSearchGroup] = useState("%");

  const handleComments = (id) => {
    window.location.pathname = `/comments/${id}`;
  };

  function sortHashtags(hashs) {
    const ht = hashs.split("#");
    const hash = [];
    for (let i = 0; i < ht.length; i++) {
      if (ht[i] !== "#" || ht[i] === "") {
        hash[i] = "#" + ht[i + 1];
      }
    }
    setHashtags(hash);
  }

  async function getPosts() {
    setOrderby("date");
    setOrder("dsc");
    setSearchUser("%");
    setSearchGroup("%");
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${searchGroup}&user=${searchUser}&orderby=${orderby}&order=${order}`, {//type=location || date
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  async function getPostsFiltered(group, user, type, sort) {
    if (user === "") {
      user = "%";
    }
    if (group === "") {
      group = "%";
    }
    if (type === "") {
      type = "date";
    }
    if (sort === "") {
      sort = "dsc";
    }
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${group}&user=${user}&orderby=${type}&order=${sort}`, {//type=location || date
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  const handleSearchGroup = () => {
    let sGroup = document.getElementById("searchGroup").value;
    let sUser = document.getElementById("searchUser").value;
    let sortValue = document.getElementById("sortValue").value;
    let orderValue = "";
    if (sortValue === "location") {
      sortValue = "";
      orderValue = "location";
    } else {
      orderValue = "date";
    }

    if (sGroup === '') {
      sGroup = '%';
    }
    if (sUser === '') {
      sUser = '%';
    }
    getPostsFiltered(sGroup, sUser, orderValue, sortValue);
  }
  const handleSort = () => {
    let sortValue = document.getElementById("sortValue").value;
    let orderValue = "";
    if (sortValue === "location") {
      sortValue = "";
      orderValue = "location";
    } else {
      orderValue = "date";
    }

    getPostsFiltered(searchGroup, searchUser, orderValue, sortValue);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className= "filter">
        {/* <h3>Sort Feed</h3> */}
        {/* <div className="dropdown"> */}
          <label>Sort by:</label>
          <select id="sortValue" className="sort"
            defaultValue="dsc"  onInput={() => handleSearchGroup()}>
            <option value={"location"}>Nearest</option>
            <option value={"dsc"} >Most Recent</option>//date
            <option value={"asc"} >Oldest</option>//date
          </select>
        </div>
          
          {/* <div className="filter">
            <input type="search"
              id="searchGroup"
              placeholder="Search Group..."
              onInput={() => handleSearchGroup()} />
          </div>
          <div className="filter">
            <input type="search"
              id="searchUser"
              placeholder="Search User..."
              onInput={() => handleSearchGroup()} />
          </div> */}
        {/* </div> */}
      {/* </div> */}
      
      {/* <h1 className="posts heading">Feed:</h1> */}
      <div className="content">
        {data.length === 0 ? (
          <div className="card posts">
            <label>There are no posts to show</label>
          </div>
        ) : (
          <div className="post-bubble">
            {data.map((d) => (
              <div className="single-post">
                <div className="user-group-name">
                  <label className="username">{"@" + d["user.username"]}</label>
                  <label className="groupname">{d["group.name"]}</label>
                  <label className="post-time">
                  {moment(d.date).format("hh:mm A") +
                    " - " +
                    moment(d.date).format("DD/MM")}
                </label>
                </div>
                <div className="post-text">
                  <label >{d.text}</label>
                </div>
                
                {d.video_url === '' ? (
                  <label></label>
                ) : (
                  <div className="post-vid">
                    <ReactPlayer url={'./videos/'.concat(d.video_url.split('h')[1])} controls={true} className="react-player" width="100%" height="100%"/>    
                  </div>
                )}

                {/* {sortHashtags(d.hashtags_text)}
                {hashtags.map(() => (
                  <label></label>
                ))} */}
                
                <label className="hashtag">{d.hashtags_text}</label>
                
                <div className="button-map-elements">
                  
                  {d.latitude == null ? (
                  <label></label>
                  ) : (
                    // <div>
                    <ShowMap lat={d.latitude} lng={d.longitude}></ShowMap>
                    // </div>
                  )}
                  <button
                  className="show-comment-btn"
                  onClick={() => handleComments(d.id)}
                  >
                  Comments
                  </button>
                </div>

                
                
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
