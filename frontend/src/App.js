import React from 'react';
import './App.css';
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import './Components/CSS/LoginCSS.css';
import ViewComments from './Components/ViewComments';
import EditDevProfile from './Components/Profile';
import UpdateProfile from './Components/UpdateProfile';

function App() {
  return (
    <Router>
      <div >
        <Router>
          <Route exact path='/login' component={Login} />
          <Route exact path='/DevReg' component={SignUp} />
          <ProtectedRoute exact path='/ViewProfile' component={UpdateProfile} />
          <ProtectedRoute exact path='/UpdateProfile' component={EditDevProfile} />
          <ProtectedRoute exact path='/' component={Home} />
          <ProtectedRoute path='/comments' component={ViewComments} />
        </Router>
      </div>
    </Router>
  );
}

export default App;

