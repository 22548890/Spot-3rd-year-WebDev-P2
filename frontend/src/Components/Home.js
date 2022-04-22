import './CSS/Home.css';
import logo from '../SPOT.svg'
import moment from 'moment'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

function Home() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = "/login";
  };
  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const [contractName, setName] = useState('')
  const [contractLength, setLength] = useState('')
  const [contractValue, setValue] = useState('')
  const [contractDes, setDes] = useState('')
  const [contractLan, setLan] = useState('')
  const [location, setLocation] = useState('')
  const [open] = useState(true)
  const [data, setData] = useState([]);
  const [onceOff, setOnceOff] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!contractLength || !contractName || !contractValue || !contractDes || !contractLan) {
      setName('Demo')
      setLength('0')
      setValue('0')
      setLan('')
      setLocation('')
    }

        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': contractName,
                'length': contractLength,
                'value': contractValue,
                'description': contractDes,
                'programming_language': contractLan,
                'location': location,
                'open': open
            }),
        }
        fetch('http://127.0.0.1:5000/createContract', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));
        
        //window.location.pathname = "/";
        setName('')
        setLength('')
        setValue('')
        setDes('')
        setLan('')
        setLocation('')

}


  if (onceOff) {
    fetch(`http://127.0.0.1:5000/getAvailableContracts/date/DSC`, {
      'method': 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => setData(response))
      .catch(error => console.log(error));
    //setOnceOff(false);
  }

  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <img src={logo} className="logoNav" alt="Test" height="75" width="75" />

          </div>

          <ul id="menu">
          <li>
              <a onClick={"toadd"}> Groups</a>
            </li>
            <li>
              <a onClick={"toadd"}> My Groups</a>
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
        <div className="card posts feed">
          <label className="post">Post: </label>
          <input className="post" type="text" placeholder="type a post message..." onChange={(e) => setDes(e.target.value)} />
          <button className="post" onClick={onSubmit}>POST</button>
        </div>
        <h1 className="posts heading">Feed:</h1>
        <div className="feed">
          {data.map((d) => (
            <div className="card posts">
              {/* <label className="post">{d.company_name}</label>
                        <input className="post" type="text" placeholder="type a post message..."/>
                        <button className="post" >POST</button> */}
              <h3 className="post">{d.company_name}</h3>
              <label className="post">{d.description}</label>
              <label>{moment(d.date).format('hh:mm A')+" - " + moment(d.date).format("DD/MM")}</label>
            </div>

          ))}
        </div>
      </div>
    </>
  )
}

export default Home;