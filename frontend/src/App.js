import React, { useEffect } from "react";
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
import Explore from "./Components/Explore";
import ViewGroup from "./Components/ViewGroup";
import moment from "moment";
import Friends from "./Components/Friends";

function App() {
  const timeoutMinutes = 59;//only logout on use not if closed
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  const timeoutTime = localStorage.getItem("timeoutTime");
  useEffect(() => {
    if (timeoutTime==="true"){
      const timer = setTimeout(() => {
      alert("Your session has expired. You will be logged out.")
      handleLogout();
      localStorage.setItem("timeoutTime","false");
    }, 1000*60*timeoutMinutes);
    }
    // return () => clearTimeout(timer);
  }, []);

  return (
    
    <Router>
      <div>
      {/* <label>{loginTime + " "+ timeoutTime}</label>
      {(loginTime < timeoutTime) ? (
        <>{handleLogout()}</>
      ) : ( */}
        <Router>
          <Route exact path="/login" component={Login} />
          <Route exact path="/DevReg" component={SignUp} />
          <Route exact path="/logout" component={handleLogout} />
          <ProtectedRoute exact path="/ViewProfile" component={UpdateProfile} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/comments" component={ViewComments} />
          <ProtectedRoute path="/Groups" component={MyGroups} />
          <ProtectedRoute path="/CreateGroup" component={CreateGroup} />
          <ProtectedRoute path="/Explore" component={Explore} />
          <ProtectedRoute path="/Friends" component={Friends} />
          <ProtectedRoute path="/ViewGroup" component={ViewGroup} />
        </Router>
      {/* )} */}
      </div>
    </Router>
  );
}

export default App;
