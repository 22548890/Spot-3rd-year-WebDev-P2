import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
//import { FileUploader } from './Components/FileUploader';
//import { ToastContainer} from 'react-toastify';
//import ReactPlayer from "react-player";
import axios from 'axios';


const AddPost = () => {
  const [group_name, setGroupName] = useState("");
  const [category, setCat] = useState("");
  const [text, setText] = useState("");
  const [latitude, setLat] = useState(null);
  const [longitude, setLon] = useState(null);
  const [video_url, setVid] = useState("");

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

  // function FileUploadPage(){
  //   const [video_url, setVid] = useState([]);
  //   const [isFilePicked, setIsFilePicked] = useState(false);
    
  //   const changeHandler = (event) => {
      
  //     setVid(event.target.name);
  //     setIsFilePicked(true);


  //       // const data = new FormData();

  //       // for(let i = 0; i < video_url.length; i++) {
  //       //     data.append('file', video_url[i]);
  //       // }

  //       // axios.post('./videos', data)

  //   };
  
  //   const handleSubmission = () => {
  //   };
  
  //   return(
  //    <div>
  //       <input type="file" name="file" onChange={changeHandler} />
  //       <div>
  //         <button onClick={handleSubmission}>Submit</button>
  //       </div>
  //     </div>
  //   )
  // }


  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert("Please include a post description");
      return;
    }

   //video_url= video_url.split('/',1)[1];

    if (latitude != null) {
      if (!(/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/).test(latitude.toString())) {
        alert("Please include an appropraite latitude");
        return;
      }
    }
    if (longitude != null) {
      if (!(/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/).test(longitude.toString())) {
        alert("Please include an appropriate longitude");
        return;
      }
    }

    

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: "test", //group_name
        category: category,
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
          <label>Category:</label>
          <span> </span>
          <select
            className="comConSelect"
            required
            value={category}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value={"None"} hidden>
              Select Category
            </option>
            <option value={"Sport"}>Sport</option>
            <option value={"Education"}>Education</option>
            <option value={"Movies"}>Movies</option>
            <option value={"Cars"}>Cars</option>
          </select>
        </div>
        <div className="form-control">
          <label className="post">Video File:</label>
          
          <input
          
          type= "file"
          className="post"
          
           onChange={(e) =>   setVid(e.target.value)}
          
           
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
