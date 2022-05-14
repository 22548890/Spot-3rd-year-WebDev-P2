import ShowMap from "./ShowMap";
import React, { useState, useEffect } from "react";
import moment from "moment";

const Posts = () => {
  const [data, setData] = useState([]);
  // const [sortData, setSortData] = useState([]);
  // const [group, setGroup] = useState("");
  // const [groups, setGroups] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [sort, setSort] = useState(false);
  // const [lat, setLat] = useState(0);
  // const [lng, setLon] = useState(0);

  // function setLocation() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setLat(position.coords.latitude);
  //       setLon(position.coords.longitude);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  const handleComments = (id) => {
    window.location.pathname = `/comments/${id}`;
  };

  // function sortByGroup(post_group) {
  //   return post_group == group;
  // }

  async function getPosts() {
    const response = await fetch(`http://127.0.0.1:5000/feed/main`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": sessionStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  useEffect(() => {
    getPosts();
  }, []);

  // async function getMyGroups() {
  //   const response = await fetch(`http://127.0.0.1:5000/groups/all`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "access-token": sessionStorage.getItem("token"),
  //     },
  //   });
  //   setGroups(await response.json());
  //   return;
  // }

  // useEffect(() => {
  //   getMyGroups();
  // }, []);

  return (
    <div className="feed">
      {/* <div className="card posts feed">
        <label>Sort By:</label>
        <table>
          <select
            className="comConSelect"
            required
            value={group}
            onChange={(e) => {
              setSort(true);
              setSortData(
                data.filter(function (d) {
                  return d["group.name"] === e.target.value;
                })
              );
            }}
          >
            <option value={"None"} hidden>
              Group
            </option>
            {groups.map((d) => (
              <option value={d.name}>{d.name}</option>
            ))}
          </select>
          <select
            className="comConSelect"
            required
            value={group}
            onClick={() => {
              setSort(true);
              setSortData(
                data.filter(function (d) {
                  return d.latitude != null;
                })
              );
              setSortData(
                sortData.sort(function (a, b) {
                  var distA = Math.sqrt(
                    (lat - a.latitude) * (lat - a.latitude) +
                      (lng - a.longitude) * (lng - a.longitude)
                  );
                  var distB = Math.sqrt(
                    (lat - b.latitude) * (lat - b.latitude) +
                      (lng - b.longitude) * (lng - b.longitude)
                  );
                  if (distA < distB) return -1;
                  if (distA > distB) return 1;
                  return 0;
                })
              );
            }}
          >
            <option value={"None"} hidden>
              Location
            </option>
          </select>
          <select
            className="comConSelect"
            required
            value={group}
            onClick={() => {
              setSort(true);
              setSortData(data);
            }}
          >
            <option value={"None"} hidden>
              Time
            </option>
          </select>
        </table>
      </div> */}
      {/* {sort ? (
        <div>
          {sortData.map((d) => (
            <div className="card posts">
              <h3 className="post">{"@" + d["user.username"]}</h3>
              <label className="post-text">{d.text}</label>
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
              <label></label>
              {d.latitude == null ? (
                <label></label>
              ) : (
                <ShowMap lat={d.latitude} lng={d.longitude}></ShowMap>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div> */}
      {data.map((d) => (
        <div className="card posts">
          <h3 className="post">{"@" + d["user.username"]}</h3>
          <label className="post-text">{d.text}</label>
          <label>
            {moment(d.date).format("hh:mm A") +
              " - " +
              moment(d.date).format("DD/MM")}
          </label>
          <label className="show-comment" onClick={() => handleComments(d.id)}>
            Show Comments
          </label>
          <label></label>
          {d.latitude == null ? (
            <label></label>
          ) : (
            <ShowMap lat={d.latitude} lng={d.longitude}></ShowMap>
          )}
        </div>
      ))}
      {/* </div> */}
      {/* )} */}
    </div>
  );
};

export default Posts;
