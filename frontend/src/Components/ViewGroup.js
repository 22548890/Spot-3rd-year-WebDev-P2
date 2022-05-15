import React from "react";
import Swal from "sweetalert2";

const ImgUpload = ({ onChange, src, value }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img className="loginimg" src={src} alt="User Avatar" />
    </div>
    <input
      id="avatar_url_upload"
      type="url"
      value={value}
      onChange={onChange}
      placeholder={"Paste URL.."}
      required
    />
  </label>
);

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
  window.location.pathname = "/Explore";
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
          <Group
            onSubmit={this.handleSubmit}
            name={name}
          />
        )}
      </div>
    );
  }
}

export default ViewGroup;
