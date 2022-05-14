import React from 'react'

const Friends = () => {
    const handleViewProfile = () => {
        window.location.pathname = "/ViewProfile";
      };
    
      const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.pathname = "/login";
      };
    
      const handleHome = (e) => {
        e.preventDefault();
        window.location.pathname = "/";
      };

      const handleViewGroups = () => {
        window.location.pathname = "/Groups";
      };
  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <label>Spot</label>
          </div>

          <ul id="menu">
            <li>
              <a onClick={handleViewGroups}> Groups</a>
            </li>
            <li>
              <a onClick={handleViewProfile}> Profile</a>
            </li>
            <li>
              <button className="styleBtn" onClick={handleLogout}>
                Logout{" "}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div>
        <button className="btn home" onClick={handleHome}>
          Back Home
        </button>
      </div>
    </>
  )
}

export default Friends