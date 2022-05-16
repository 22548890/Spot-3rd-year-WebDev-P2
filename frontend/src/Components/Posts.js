import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";

const Posts = () => {
  const [data, setData] = useState([]);
  const [hashtags, setHashtags] = useState("%");
  const [isClick, setClick] = useState("0");
  const [orderby, setOrderby] = useState("date");
  const [order, setOrder] = useState("dsc");
  const [searchUser, setSearchUser] = useState("%");
  const [searchGroup, setSearchGroup] = useState("%");
  const [latitude, setLat] = useState("%");
  const [longitude, setLng] = useState("%");
  const [radius, setRadius] = useState("%");
  const [showLoc, setLocTrue] = useState(true);
  const [locationShared, setShare] = useState(false);

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (err) => {
        console.log(err);
      }
    );
    if (document.getElementById("checkLoc").checked===false){
      window.location.reload();
    }
  }

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
    setLat("%");
    setLng("%");
    setRadius("%");
    const response = await fetch(
      `http://127.0.0.1:5000/feed/group=${searchGroup}&user=${searchUser}&tag=${hashtags}&orderby=${orderby}&order=${order}&lat=${latitude}&lng=${longitude}&radius=${radius}`,
      {
        //type=location || date
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

  async function getPostsFiltered(
    group,
    user,
    type,
    sort,
    tag,
    lat,
    long,
    rad
  ) {
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
    if (lat === "") {
      lat = "%";
    }
    if (long === "") {
      long = "%";
    }
    if (rad === "") {
      rad = "%";
    }
    const response = await fetch(
      `http://127.0.0.1:5000/feed/group=${group}&user=${user}&tag=${tag}&orderby=${type}&order=${sort}&lat=${lat}&lng=${long}&radius=${rad}`,
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

  const onSubmitLocation = () => {
    //ifs
    //error handleSignup

    handleSearchGroup();
  };

  const handleSearchGroup = () => {
    let sGroup = document.getElementById("searchGroup").value;
    let sUser = document.getElementById("searchUser").value;
    let sortValue = document.getElementById("sortValue").value;
    let sTag = document.getElementById("searchTag").value;
    let sLat = "%";
    let sLng = "%";
    if (document.getElementById("checkLoc").checked === false) {
      sLat = document.getElementById("sortLat").value;
      sLng = document.getElementById("sortLng").value;
    } else {
      sLat = latitude;
      sLng = longitude;
    }
    let sRadius = document.getElementById("sortRadius").value;
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

    if (sGroup === "") {
      sGroup = "%";
    }
    if (sUser === "") {
      sUser = "%";
    }
    if (sTag === "") {
      sTag = "%";
    }
    if (sRadius === "") {
      sTag = "%";
    } else {
      if (!/^\d+$/.test(sRadius)) {
        Swal.fire(
          "Please only include numbers for radius",
          "Try again!",
          "warning"
        );
        return;
      }
      if (sLng === "" || sLat === "") {
        Swal.fire(
          "Please include an appropriate latitude and longitude if using radius",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (sLat === "") {
      sLat = "%";
    } else {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(sLat) ||
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(sLng)
      ) {
        Swal.fire(
          "Please include an appropriate latitude and longitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (sLng === "") {
      sLng = "%";
    } else {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(sLat) ||
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(sLng)
      ) {
        Swal.fire(
          "Please include an appropriate latitude and longitude",
          "Try again!",
          "warning"
        );
        return;
      } else {
        setShare(true);
      }
    }

    getPostsFiltered(
      sGroup,
      sUser,
      orderValue,
      sortValue,
      sTag,
      sLat,
      sLng,
      sRadius
    );
  };

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
            <select
              id="sortValue"
              className="comConSelect"
              defaultValue="dsc"
              onInput={() => handleSearchGroup()}
            >
              {locationShared ? (
                <>
                  <option value={"location"}>Nearest</option>
                  <option value={"dsc"}>Most Recent</option>
                  <option value={"asc"}>Oldest</option>
                  <option value={"furthest"}>Furthest</option>
                </>
              ) : (
                <>
                  <option value={"dsc"}>Most Recent</option>
                  <option value={"asc"}>Oldest</option>
                </>
              )}
            </select>
          </div>
          <div className="filter">
            <input
              type="search"
              id="searchGroup"
              placeholder="Search Group..."
              onInput={() => handleSearchGroup()}
            />
          </div>
          <div className="filter">
            <input
              type="search"
              id="searchUser"
              placeholder="Search User..."
              onInput={() => handleSearchGroup()}
            />
          </div>
          <div className="sort">
            <input
              type="search"
              id="searchTag"
              placeholder="Search Tag..."
              onInput={() => handleSearchGroup()}
            />
          </div>
          <br></br>
        </div>
        <label>Sort by a location:</label>
        <label>Current Location:</label>

        <form className="add-form">
          <input
            type="checkbox"
            id="checkLoc"
            name="location"
            onChange={() => {
              setLocation();
              setLocTrue(true);
              setLocTrue(false);
            }}
          />
          {showLoc ? (
            <>
              <div className="sort">
                <br></br>

                <label>Certain Location</label>
                <br />
                <input
                  type="search"
                  id="sortLat"
                  placeholder="Search latitude..."
                  onChange={() => setLat()}
                />
              </div>
              <div className="sort">
                <input
                  type="search"
                  id="sortLng"
                  placeholder="Search Longitude..."
                  onChange={() => setLng()}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="sort">
            <input
              type="search"
              id="sortRadius"
              placeholder="Type radius..."
              onChange={() => setRadius()}
            />
          </div>
          <button
            type="button"
            className="post feed"
            onClick={() => {
              onSubmitLocation();
            }}
          >
            Search
          </button>
        </form>
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
                {d.video_url === "" ? (
                  <label></label>
                ) : (
                  <label className="postvid">
                    <ReactPlayer
                      url={"./videos/".concat(d.video_url.split("h")[1])}
                      controls={true}
                    />
                  </label>
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
