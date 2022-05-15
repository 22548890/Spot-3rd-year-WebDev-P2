import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddPost = () => {
  const [data, setData] = useState([]);
  const [group_name, setGroupName] = useState("");
  const [category, setCat] = useState("");
  const [text, setText] = useState("");
  const [latitude, setLat] = useState(null);
  const [longitude, setLon] = useState(null);
  const [video_url, setVid] = useState("");
  const [isDuplicate, setDuplicate] = useState(false);

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  function setHashtags(hashtag) {
    setDuplicate(false);
    const ht = hashtag.split("#");
    const hash = [];
    for (let i = 0; i < ht.length; i++) {
      if (i !== ht.length - 1) {
        hash[i] = "#" + ht[i + 1];
      }
    }
    setCat(hash);
    for (let i = 0; i < ht.length; i++) {
      for (let j = i + 1; j < ht.length; j++) {
        if (hash[i] === hash[j]) setDuplicate(true);
      }
    }
  }

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

  useEffect(() => {
    getMyGroups();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      Swal.fire("Please include a post description", "Try again!", "warning");
      return;
    }
    if (latitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          latitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate latitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (longitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          longitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate longitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (/\s/g.test(category)) {
      Swal.fire(
        "Please do not include spaces with hashtags",
        "Try again!",
        "warning"
      );
      return;
    }
    if (
      !/(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])/.test(
        category
      )
    ) {
      Swal.fire("Please include at least 3 hashtags", "Try again!", "warning");
      return;
    }
    if (isDuplicate) {
      Swal.fire("Please include UNIQUE hashtags", "Try again!", "warning");
      return;
    }
    if (group_name === "" && document.getElementById("group_name").value==="") {
      Swal.fire("Please select a group", "Try again!", "warning");
      return;
    }

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: document.getElementById("group_name").value,
        hashtags: category,
        text: text,
        video_url: video_url,
        longitude: longitude,
        latitude: latitude,
      }),
    };
    fetch("http://127.0.0.1:5000/post", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    window.location.reload();

    setGroupName("");
    setCat("");
    setText("");
    setLon("");
    setLat("");
    setVid("");
  };

  return (
    <div className="card posts feed">
      {/* <label>{sessionStorage.getItem('token')}</label> */}
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label className="post">Post:</label>
          <input
            className="post"
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="post">Hashtags for Post(include atleast 3):</label>
          <br></br>
          <input
            className="post"
            type="text"
            placeholder="#typehashtagshere"
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Choose Group:</label>
          <span> </span>
          <select
            className="comConSelect"
            required
            id="group_name"
            // value={group_name}
            // onChange={(e) => setGroupName(e.target.value)}
          >
            <option value={category} hidden>
              Select group
            </option>
            {data.map((d) => (
              <option value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="post">Video File:</label>

          <input
            type="file"
            className="post"
            onChange={(e) => setVid(e.target.value)}
          />
        </div>

        <div className="form-control form-control-check">
          <label>Share Location(automatic):</label>
          <input
            type="radio"
            name="location"
            onChange={() => {
              setLocation();
            }}
          />
        </div>
        <div className="form-control">
          <label>Share Location(Manually):</label>
          <br></br>
          <input
            className="post"
            type="text"
            placeholder="latitude"
            onChange={(e) => setLat(e.target.value)}
          />
          <br></br>
          <input
            className="post"
            type="text"
            placeholder="longitude"
            onChange={(e) => setLon(e.target.value)}
          />
        </div>
        <button
          className="post"
          onClick={() => {
            onSubmit();
          }}
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
