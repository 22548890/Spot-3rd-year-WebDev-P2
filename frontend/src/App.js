import React, { useEffect, useState } from "react";
import "./App.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./Components/CSS/LoginCSS.css";
import ViewComments from "./Components/ViewComments";
import UpdateProfile from "./Components/UpdateProfile";
import MyGroups from "./Components/Groups";
import CreateGroup from "./Components/CreateGroup";
import ViewGroup from "./Components/ViewGroup";
import Friends from "./Components/Friends";
import ShowGroup from "./Components/ShowGroup";


function App() {
  const [data, setData] = useState([]);
  const timeoutMinutes = 59;//only logout on use not if closed
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  const timeoutTime = localStorage.getItem("timeoutTime");
  useEffect(() => {
    if (timeoutTime === "true") {
      const timer = setTimeout(() => {
        alert("Your session has expired. You will be logged out.")
        handleLogout();
        localStorage.setItem("timeoutTime", "false");
      }, 1000 * 60 * timeoutMinutes);
    } 
    // getTimeout();
     
  }, []);

  // async function getTimeout() {
  //   const response = await fetch(`http://127.0.0.1:5000/timeout`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "access-token": localStorage.getItem("token"),
  //     },
  //   });
  //   setData(await response.json());
  //   if (data.timeout==="true"){
  //      handleLogout();
  //    }
  //   // return;
  // }

  return (

    <Router>
      <div>
        <Router>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/logout" component={handleLogout} />
          <ProtectedRoute exact path="/ViewProfile" component={UpdateProfile} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/comments" component={ViewComments} />
          <ProtectedRoute path="/Groups" component={MyGroups} />
          <ProtectedRoute path="/CreateGroup" component={CreateGroup} />
          <ProtectedRoute path="/Friends" component={Friends} />
          <ProtectedRoute path="/ShowGroup" component={ShowGroup} />
        </Router>
        {/* )} */}
      </div>
    </Router>
  );
}

export default App;
