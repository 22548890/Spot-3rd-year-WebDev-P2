import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactPlayer from 'react-player';

const Posts = () => {
  const [data, setData] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [sort, setSort] = useState("");

  const handleComments = (id) => {
    window.location.pathname = `/comments/${id}`;
  };

  const sorting = (column) => {
    let search = document.querySelector('input').value;
    // if (order === 'ASC') {
    //     setOrder('DSC');
    //     if (search !== '') {
    //         fetch(`http://127.0.0.1:5000//${search}/${column}/ASC`, {
    //         'method': 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //         })
    //         .then(response => response.json())
    //         .then(response => setData(response))
    //         .catch(error => console.log(error));
    //     } else {
    //         fetch(`http://127.0.0.1:5000//${column}/ASC`, {
    //         'method': 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //         })
    //         .then(response => response.json())
    //         .then(response => setData(response))
    //         .catch(error => console.log(error));
    //     }
    // }
    // if (order === 'DSC') {
    //     setOrder('ASC');
    //     if (search !== '') {
    //         fetch(`http://127.0.0.1:5000//${search}/${column}/DSC`, {
    //         'method': 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //         })
    //         .then(response => response.json())
    //         .then(response => setData(response))
    //         .catch(error => console.log(error));
    //     } else {
    //         fetch(`http://127.0.0.1:5000//${column}/DSC`, {
    //         'method': 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //         })
    //         .then(response => response.json())
    //         .then(response => setData(response))
    //         .catch(error => console.log(error));
    //     }
    // }
}

  function sortHashtags(hashs) {
    const ht = hashs.split("#");
    const hash = [];
    for (let i = 0; i < ht.length; i++) {
      if (ht[i] != "#" || ht[i] == "") {
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
        {data.length == 0 ? (
          <div className="card posts">
            <label>There are no posts to show</label>
          </div>
        ) : (
          <div>
            <div className="card posts">
              <h3>Sort Feed</h3>
              
              <input
                className="post"
                type="search"
                placeholder="Search for a User or Group..."
                on={(value) => sorting(value)}
              />
              <label>Sort by:</label>
              <select className="comConSelect" required value={"Sort feed"} onChange={(value) => sorting(value)}>
                <option value={"Sort feed"} hidden>
                  Sort feed
                </option>
                <option value={"Location"}>Location</option>
                <option value={"Time"}>Time descending</option>
                <option value={"Group"}>Group</option>
                <option value={"User"}>User</option>
                
              </select>
            </div>
            {data.map((d) => (
              <div className="card posts">
                <h3 className="post">{"@" + d["user.username"]}</h3>
                <label className="post-text">{d.text}</label>
                {d.video_url == '' ? (
                  <label></label>
                ) : (
                  <label className="postvid"><ReactPlayer url = {'./videos/'.concat(d.video_url.split('h')[1])} controls = {true}/></label>
                )}
                
                {/* {sortHashtags(d.hashtags_text)}
                {hashtags.map(() => (
                  <label></label>
                ))} */}
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
