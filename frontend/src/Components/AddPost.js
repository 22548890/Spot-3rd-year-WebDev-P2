import { useState } from 'react'
import React from "react"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import "./CSS/Posts.css"
import { GrLocation } from 'react-icons/gr'
import { FaLocationArrow } from 'react-icons/fa'

const AddPost = ({ onAdd, showAdd }) => {
    const [postName, setName] = useState('')
    const [postCategory, setCat] = useState('')
    const [postDescrip, setDes] = useState('')
    const [latitude, setLat] = useState('')
    const [longitude, setLon] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();
        if (!postName || !postDescrip) {
            alert('Please include a post name and description')
            return
        }

        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': postName,
                'category': postCategory,
                'description': postDescrip,
                'latitude': latitude,
                'longitude': longitude
            }),
        }
        fetch('http://localhost:6000/post', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));

        window.location.pathname = "/";
        setName('')
        setCat('')
        setDes('')
        setLat('')
        setLon('')

    }
    const handleHome = () => {
        window.location.pathname = "/";
    }


    return (
        <div className="container">
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Post Name</label>
                    <input type='text' placeholder='Add Post name' value={postName} onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='form-control'>
                    <input type='text' placeholder="What's happening?"
                        value={postDescrip} onChange={(e) => setDes(e.target.value)}
                    />
                </div>
                <div className='form-control'>
                    <label>Category</label>
                    <span> </span>
                    <select className="comConSelect" required value={postCategory} onChange={(e) => setCat(e.target.value)}>
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
            <button className="btn" onClick={() => { handleHome() }}>Cancel</button>
        </div>

    )
}

export default AddPost
