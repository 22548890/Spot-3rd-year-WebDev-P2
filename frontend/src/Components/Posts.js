import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";

const Posts = () => {
  const [data, setData] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [sort, setSort] = useState("");

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
    const response = await fetch(`http://127.0.0.1:5000/feed/main`, {
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
    getPosts();
  }, []);

  return (
    <>
      <h1 className="posts heading">Feed:</h1>
      <div className="feed">
        {data.length === 0 ? (
          <div className="card posts">
            <label>There are no posts to show</label>
          </div>
        ) : (
          <div>
            <div className="card posts">
              <h3>Sort Feed</h3>
              <div className="dropdown">
                <label>Sort by:</label>
                <div className="sort"><select className="comConSelect" 
                defaultValue="Recent" required >
                  <option value={"Nearest"}>Nearest</option>
                  <option value={"Recent"}>Most Recent</option>
                  <option value={"Oldest"}>Oldest</option>
                </select></div>
                <div className="filter">
                  <label>Filter by:</label>
                  <select className="comConSelect" defaultValue="All" 
                  required >
                    <option value={"Groups"}>My Groups</option>
                    <option value={"Friends"}>My Friends</option>
                    <option value={"All"}>All</option>
                  </select>
                </div>
              </div>


            </div>
            {data.map((d) => (
              <div className="card posts">
                <h3 className="post">{"@" + d["user.username"]}</h3>
                <label className="post-text">{d.text}</label>
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
