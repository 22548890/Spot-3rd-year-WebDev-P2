import React from "react";
import "./App.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./Components/CSS/LoginCSS.css";
import ViewComments from "./Components/ViewComments";
import EditDevProfile from "./Components/Profile";
import UpdateProfile from "./Components/UpdateProfile";
import MyGroups from "./Components/Groups";
import CreateGroup from "./Components/CreateGroup";
import Explore from "./Components/Explore";
import ViewGroup from "./Components/ViewGroup";

function App() {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  return (
    <Router>
      <div>
        <Router>
          <Route exact path="/" component={Login} />
          <Route exact path="/DevReg" component={SignUp} />
          <Route exact path="/logout" component={handleLogout} />
          <ProtectedRoute exact path="/ViewProfile" component={UpdateProfile} />
          <ProtectedRoute
            exact
            path="/UpdateProfile"
            component={EditDevProfile}
          />
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute path="/comments" component={ViewComments} />
          <ProtectedRoute path="/Groups" component={MyGroups} />
          <ProtectedRoute path="/CreateGroup" component={CreateGroup} />
          <ProtectedRoute path="/Explore" component={Explore} />
          <ProtectedRoute path="/ViewGroup" component={ViewGroup} />
        </Router>
      </div>
    </Router>
  );
}

export default App;
