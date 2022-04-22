import React from 'react';
import './App.css';
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import './Components/CSS/LoginCSS.css';
import ViewProfile from './Components/ViewProfile';
import EditDevProfile from './Components/Profile';

function App() {
  return (
    <Router>
      <div >
        <Router>
          <Route exact path='/login' component={Login} />
          <Route exact path='/DevReg' component={SignUp} />
          <ProtectedRoute exact path='/ViewProfile' component={ViewProfile} />
          <ProtectedRoute exact path='/EditDevProfile' component={EditDevProfile} />
          <ProtectedRoute exact path='/' component={Home} />
        </Router>
      </div>
    </Router>
  );
}

export default App;

