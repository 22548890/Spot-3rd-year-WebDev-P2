import './CSS/Home.css';
import logo from '../SPOT.svg'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import ShowMap from "./ShowMap";

export default function ViewComments() {
    const [text, setText] = useState('')
    const [comment, setComment] = useState('')
    const [data, setData] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const [onceOff, setOnceOff] = useState(true);

    const onSubmit = (e) => {
        e.preventDefault();
        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'access-token': localStorage.getItem("token") },
            body: JSON.stringify({
                'text': document.getElementById("comment").value,//group_name
                'post_id': postId,
            }),
        }
        fetch('http://127.0.0.1:5000/comment', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));

        window.location.reload();
    }
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.pathname = "/login";
    };
    const handleViewProfile = () => {
        window.location.pathname = "/ViewProfile";
    };
    const handleBack= () => {
        window.location.pathname = "/";
    };
    const handleViewGroups = () => {
        window.location.pathname = "/Groups";
      };
    
      const handleViewExplore = () => {
        window.location.pathname = "/Explore";
      };
    
      const handleFriends = () => {
        window.location.pathname = "/Friends";
      };

    async function getPost() {
        const response = await fetch(`http://127.0.0.1:5000/get/post=${postId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "access-token": localStorage.getItem("token")},
        });
        setDataPost(await response.json());
        return;
    }

    async function getComments() {
        const response = await fetch(`http://127.0.0.1:5000/comments/post=${postId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "access-token": localStorage.getItem("token") },
        });
        setData(await response.json());
        return;
    }
    var str = "" + window.location.pathname;
    var postId = str.substring(str.lastIndexOf("/") + 1, str.length);
    //console.log(postId);

    useEffect(() => {
        getComments();
        getPost();
    }, [])
    return (
        <>
            <nav id="navbar" class="">
                <div className="nav-wrapper">
                    <div className="logo" onClick={handleBack}>
                        <img src={logo} className="logoNav" alt="Test" height="75" width="75" />

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
                            <button className="styleBtn" onClick={handleLogout} >Logout </button>
                        </li>
                    </ul>
                </div>

            </nav>
            <div>
                <div className="feed">
                    {/* {data.map((d) => ( */}
                    <div className="card posts">
                        <h3 className="post">{"@" + dataPost["user.username"]}</h3>
                        <label className="post-text">{dataPost.text}</label>
                        <label>{dataPost.hashtags_text}</label>
                        <label>Location: {dataPost.latitude+" "+dataPost.longitude}</label>
                        <ShowMap lat={dataPost.latitude} lng={dataPost.longitude}></ShowMap>
                        <label>{moment(dataPost.date).format('hh:mm A') + " - " + moment(data.date).format("DD/MM")}</label>
                    </div>
                    {/* ))} */}
                </div>
                {/* <button onClick={handleBack} className="comment back-btn">Return to posts</button> */}
                <div className="card posts feed">
                    <label className="post">Add a Comment: </label>
                    <input className="post" id="comment" type="text" placeholder="Add a comment..." onChange={(e) => setText(e.target.value)} />
                    <button className="post" onClick={onSubmit}>Comment</button>
                </div>
                <h1 className="posts heading">Comments:</h1>
                <div className="card posts feed">
                    {data.map((d) => (
                        <>
                            <label className="post-text">{d.text+ " ~ "+d['user.username']} </label>
                            <label>{moment(d.date).format('hh:mm A') + " - " + moment(d.date).format("DD/MM")}</label>

                        </>

                    ))}
                </div>
            </div>
        </>
    )

}