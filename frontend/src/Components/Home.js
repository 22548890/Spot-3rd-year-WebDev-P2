import "./CSS/Home.css";
import logo from "../SPOT.svg";
import BigMap from "./BigMap";
import Posts from "./Posts";
import AddPost from "./AddPost";


function Home() {
  const handleLogout = () => {
    backendLogout();
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };
  async function backendLogout() {
    const requestOpt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "access-token": localStorage.getItem("token") },
    }
    return await fetch('http://127.0.0.1:5000/logout', requestOpt)
      .then(response => response.json())
      .catch(error => console.log(error));
  }
  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <img
              src={logo}
              className="logoNav"
              alt="Test"
              height="75"
              width="75"
            />
          </div>

          <ul id="menu">
            <li>
              <a onClick={handleFriends}> Friends</a>
            </li>
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
        <AddPost></AddPost>
        <BigMap></BigMap>
        <Posts></Posts>
      </div>
    </>
  );
}

export default Home;
