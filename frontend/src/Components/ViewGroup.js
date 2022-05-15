import React from "react";
import Swal from "sweetalert2";

// const ImgUpload = ({ onChange, src, value }) => (
//   <label htmlFor="photo-upload" className="custom-file-upload fas">
//     <div className="img-wrap img-upload">
//       <img className="loginimg" src={src} alt="User Avatar" />
//     </div>
//     <input
//       id="avatar_url_upload"
//       type="url"
//       value={value}
//       onChange={onChange}
//       placeholder={"Paste URL.."}
//       required
//     />
//   </label>
// );

const GroupName = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="name">Group Name:</label>
    <input
      id="name"
      type="text"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="..."
      required
    />
  </div>
);

const GroupBio = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="bio">Provide a description of your group!</label>
    <input
      id="bio"
      type="text"
      onChange={onChange}
      maxLength="60"
      value={value}
      placeholder="Group bio..."
      required
    />
  </div>
);

const handleViewExplore = (e) => {
  e.preventDefault();
  window.location.pathname = "/Groups";
};

const Group = ({ onSubmit, name }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Group Successfully Created!</h1>
      <div className="name">{name}</div>
      {/* <div className="bio">{bio}</div> */}
      <button type="submit" className="styleBtn edit">
        Edit Details{" "}
      </button>
    </form>
  </div>
);

const Edit = ({ onSubmit, children }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Group Name</h1>
      {children}
      <button type="submit" className="styleBtn save" onClick={""}>
        Join Group!{" "}
      </button>
      <button className="btn" onClick={handleViewExplore}>
        {" "}
        Back{" "}
      </button>
    </form>
  </div>
);

class ViewGroup extends React.Component {
  state = {
    name: "",
    active: "edit",
  };
  editName = (e) => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let data = this.state;
    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: data.name,
      }),
    };

    async function fetchFunc() {
      return await fetch("http://127.0.0.1:5000/group/create", requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      let info = await fetchFunc();
      if (info.success) {
        window.location.pathname = "/Groups";
      } else {
        Swal.fire(info.msg, "Try again!", "warning");
      }
    })();
  };

  render() {
    const { name, active } = this.state;
    return (
      <div>
        {active === "edit" ? (
          <Edit onSubmit={this.handleSubmit}>
            <label>Group Description</label>
            <p> ... </p>
          </Edit>
        ) : (
          <Group onSubmit={this.handleSubmit} name={name} />
        )}
      </div>
    );
  }
}

export default ViewGroup;

// import React, { useState, useEffect } from "react";
// import "./CSS/LoginCSS.css";
// import logo from "../SPOT.svg";

// function ViewGroup() {
//   const [data, setData] = useState([]);
//   const [dataAllGroups, setDataAllGroups] = useState([]);
//   // const [dataAdmin, setAdmin] = useState([]);
//   // const [group_name, setGroupName] = useState("");
//   const admin = false;

//   const handleCreateGroup = () => {
//     window.location.pathname = "/CreateGroup";
//   };

//   const handleFriends = () => {
//     window.location.pathname = "/Friends";
//   };

//   const handleViewProfile = () => {
//     window.location.pathname = "/ViewProfile";
//   };
//   const handleGroups = () => {
//     window.location.pathname = "/Groups";
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.pathname = "/login";
//   };

//   const handleHome = (e) => {
//     e.preventDefault();
//     window.location.pathname = "/";
//   };

//   const handleDelete = (groupName) => {
//     const requestOpt = {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("token"),
//       },
//       body: JSON.stringify({
//         group_name: groupName,
//       }),
//     };
//     async function fetchFunc() {
//       return await fetch(`http://127.0.0.1:5000/group/delete`, requestOpt)
//         .then((response) => response.json())
//         .catch((error) => console.log(error));
//     }
//     (async () => {
//       await fetchFunc();
//     })();
//     alert("Deleted " + groupName + " group");
//     window.location.reload();
//   };

//   async function getMyGroups() {
//     const response = await fetch(`http://127.0.0.1:5000/groups/my`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("token"),
//       },
//     });
//     setData(await response.json());
//     return;
//   }

//   async function getAllGroups() {
//     const response = await fetch(`http://127.0.0.1:5000/groups/not-my`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("token"),
//       },
//     });
//     setDataAllGroups(await response.json());
//     return;
//   }

//   // async function getAdmin() {
//   //   const response = await fetch("", {
//   //     method: "GET",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //       "access-token": localStorage.getItem("token"),
//   //     },
//   //   });
//   //   setAdmin(await response.json());
//   // }

//   async function joinGroup(name) {
//     const requestOpt = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "access-token": localStorage.getItem("token"),
//       },
//       body: JSON.stringify({
//         name: name,
//       }),
//     };
//     fetch("http://127.0.0.1:5000/group/join", requestOpt)
//       .then((response) => response.json())
//       .catch((error) => console.log(error));
//     window.location.reload();
//     return;
//   }

//   useEffect(() => {
//     getMyGroups();
//     getAllGroups();
//   }, []);

//   return (
//     <>
//       <nav id="navbar" class="">
//         <div className="nav-wrapper">
//           <div className="logo" onClick={handleHome}>
//             <img
//               src={logo}
//               className="logoNav"
//               alt="Test"
//               height="75"
//               width="75"
//             />
//           </div>

//           <ul id="menu">
//             <li>
//               <a onClick={handleCreateGroup}> Create Group </a>
//             </li>
//             <li>
//               <a onClick={handleGroups}> Groups</a>
//             </li>
//             <li>
//               <a onClick={handleFriends}> Friends</a>
//             </li>
//             <li>
//               <a onClick={handleViewProfile}> Profile</a>
//             </li>
//             <li>
//               <button className="styleBtn" onClick={handleLogout}>
//                 Logout{" "}
//               </button>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       <div className="card_groups">
//         <thead>
//           <input type="text" placeholder="Search Groups..." />
//         </thead>
//       </div>

//       <h1 className="posts heading">My Groups</h1>

//       {data.length == 0 ? (
//         <div className="card feed">
//           <label>You are not currently in group</label>
//         </div>
//       ) : (
//         <div className="card feed">
//           {data.map((d) => (
//             <div className="groups">
//               <label className="post-text">{d.name}</label>
//               <label className="show-comment" onClick={handleGroups}>
//                 View Group
//               </label>
//               {/* <label className="post-text">{d.id}</label> */}
//               {admin == true ? (
//                 <div>
//                   <button onClick={() => handleDelete(d.name)}>
//                     {" "}
//                     Delete Group{" "}
//                   </button>
//                 </div>
//               ) : (
//                 <div>{/* <label>Not admin</label> */}</div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <h1 className="posts heading">All Groups</h1>
//       {dataAllGroups.length == 0 ? (
//         <div className="card feed">
//           <label>There are no groups to join</label>
//         </div>
//       ) : (
//         <div className="feed card">
//           {dataAllGroups.map((d) => (
//             <div className="groups">
//               <label className="post-text">{d.name}</label>
//               <label className="show-comment" onClick={"to be added"}>
//                 View Group
//               </label>
//               {/* <label className="post-text">{d.id}</label> */}
//               <button onClick={() => joinGroup(d.name)}> Join Group </button>
//             </div>
//           ))}
//         </div>
//       )}
//       <button className="styleBtn" onClick={handleHome}>
//         Back{" "}
//       </button>
//     </>
//   );
// }

// export default ViewGroup;
