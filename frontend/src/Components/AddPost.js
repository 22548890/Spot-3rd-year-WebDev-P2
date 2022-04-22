import { useState } from 'react'
import React from "react"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import "./CSS/Posts.css"
import { GrLocation } from 'react-icons/gr'
import { FaLocationArrow } from 'react-icons/fa'

const AddPost = ({ onAdd, showAdd }) => {
    const [userName, setUserName] = useState('')
    const [groupName, setGroupName] = useState('')
    const [postName, setPostName] = useState('')
    const [category, setCat] = useState('')
    const [description, setDes] = useState('')
    const [latitude, setLat] = useState('')
    const [longitude, setLon] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();
        if (!postName || !description) {
            alert('Please include a post name and description')
            return
        }

        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'userName': userName,
                'groupName': groupName,
                'postName': postName,
                'category': category,
                'description': description,
                'latitude': latitude,
                'longitude': longitude
            }),
        }
        fetch('http://127.0.0.1:5000/createPost', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));

        setPostName('')
        setUserName('')
        setGroupName('')
        setCat('')
        setDes('')
        setLat('')
        setLon('')

    }
    
    return (
        <div className="container">
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Post Name</label>
                    <input type='text' placeholder='Add Post name' value={postName} onChange={(e) => setPostName(e.target.value)}
                    />
                </div>
                <div className='form-control'>
                    <input type='text' placeholder="What's happening?"
                        value={description} onChange={(e) => setDes(e.target.value)}
                    />
                </div>
                <div className='form-control'>
                    <label>Category</label>
                    <span> </span>
                    <select className="comConSelect" required value={category} onChange={(e) => setCat(e.target.value)}>
                        <option value={"None"} hidden >Select Category</option>
                        <option value={"Sport"} >Sport</option>
                        <option value={"Education"} >Education</option>
                        <option value={"Movies"}>Movies</option>
                        <option value={"Cars"} >Cars</option>
                    </select>
                </div>
                <div >
                    <FaLocationArrow className="icon-show" onClick={() => {
                        navigator.geolocation.getCurrentPosition(position => {
                            setLat(position.coords.latitude)
                            setLon(position.coords.longitude)
                        })
                    }} />
                </div>
                <button className="btn" onClick={() => { onSubmit() }} >Add Post</button>
            </form>
        </div>

    )
}

export default AddPost
