import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactPlayer from 'react-player';

const Posts = () => {
  const [data, setData] = useState([]);
  const [hashtags, setHashtags] = useState("%");
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
    setHashtags("%");
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${searchGroup}&user=${searchUser}&tag=${hashtags}&orderby=${orderby}&order=${order}`, {//type=location || date
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  async function getPostsFiltered(group, user, type, sort, tag) {
    if (user === "") {
      user = "%";
    }
    if (group === "") {
      group = "%";
    }
    if (tag === "") {
      tag = "%";
    }
    if (type === "") {
      type = "date";
    }
    if (sort === "") {
      sort = "dsc";
    }
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${group}&user=${user}&tag=${tag}&orderby=${type}&order=${sort}`, {//type=location || date
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
    let sTag = document.getElementById("searchTag").value;
    let orderValue = "";
    if (sortValue === "location") {
      sortValue = "";
      orderValue = "location";
    } else if (sortValue === "furthest") {
      orderValue = "location";
      sortValue = "asc";
    } else {
      orderValue = "date";
    }

    if (sGroup === '') {
      sGroup = '%';
    }
    if (sUser === '') {
      sUser = '%';
    }
    if (sTag === '') {
      sTag = '%';
    }
    getPostsFiltered(sGroup, sUser, orderValue, sortValue, sTag);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className="card posts">
        <h3>Sort Feed</h3>
        <div className="dropdown">
          <label>Sort by:</label>
          <div className="sort">
            <select id="sortValue" className="comConSelect"
              defaultValue="dsc" onInput={() => handleSearchGroup()}>
              <option value={"location"}>Nearest</option>
              <option value={"dsc"} >Most Recent</option>
              <option value={"asc"} >Oldest</option>
              <option value={"furthest"} >Furthest</option>
            </select></div>
          <div className="filter">
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
          </div>
          <div className="sort">
            <input type="search"
              id="searchTag"
              placeholder="Search Tag..."
              onInput={() => handleSearchGroup()} />
          </div>
        </div>

      </div>
      <h1 className="posts heading">Feed:</h1>
      <div className="feed">
        {data.length === 0 ? (
          <div className="card posts">
            <label>There are no posts to show</label>
          </div>
        ) : (
          <div>
            {data.map((d) => (
              <div className="card posts">
                <h3 className="post">{"@" + d["user.username"]}</h3>
                <label className="post-text">{d.text}</label>
                {d.video_url === '' ? (
                  <label></label>
                ) : (
                  <label className="postvid"><ReactPlayer url={'./videos/'.concat(d.video_url.split('h')[1])} controls={true} /></label>
                )}

                {/* {sortHashtags(d.hashtags_text)}
                {hashtags.map(() => (
                  <label></label>
                ))} */}
                <label>{d["group.name"]}</label>
                <label>{d.hashtags_text}</label>
                <label>
                  {moment(d.date).format("hh:mm A") +
                    " - " +
                    moment(d.date).format("DD/MM")}
                </label>
                <label
                  className="show-comment"
                  onClick={() => handleComments(d.id)}
                >
                  Show Comments
                </label>
                {d.latitude == null ? (
                  <label></label>
                ) : (
                  <ShowMap lat={d.latitude} lng={d.longitude}></ShowMap>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
