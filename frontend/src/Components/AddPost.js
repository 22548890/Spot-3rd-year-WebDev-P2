import { useState } from 'react'
import React from "react"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import Swal from 'sweetalert2'
import "../CSS/Posts.css"

const AddPost = ({ onAdd, showAdd }) => {
    const [postName, setName] = useState('')
    const [postCategory, setCat] = useState('')
    const [postDescrip, setDes] = useState('')
    const [latitude, setLat] = useState('')
    const [longitude, setLon] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();
        if (!postName || !postDescrip) {
            Swal.fire(
                'Please include a post name and description',
                '',
                'warning',
            )
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
        fetch('http://127.0.0.1:5000/createPost', requestOpt)
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
                    <select className="comConSelect" required value={postCategory} onChange={(e) => setLan(e.target.value)}>
                        <option value={"None"} hidden >Select Category</option>
                        <option value={"Sport"} >Sport</option>
                        <option value={"Education"} >Education</option>
                        <option value={"Movies"}>Movies</option>
                        <option value={"Cars"} >Cars</option>
                    </select>
                </div>
                <div className='form-control form-control-check'>
                    <button className="btn-block" onClick={(e) => {
                        navigator.geolocation.getCurrentPosition(position => {
                            setLat(position.coords.latidude)
                            setLon(position.coords.longitude)
                        })
                    }} >Share Location</button>
                </div>
                <button className="btn-block" onClick={() => { onSubmit() }} >Add Post</button>
            </form>
            <button className="back" onClick={() => { handleHome() }}>Cancel</button>
        </div>

    )
}

export default AddPost