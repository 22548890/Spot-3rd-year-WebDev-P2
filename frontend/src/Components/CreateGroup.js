import React from "react";
import Swal from "sweetalert2";

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

const handleViewGroups = (e) => {
  e.preventDefault();
  window.location.pathname = "/Groups";
};

const Group = ({ onSubmit, name }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Group Successfully Created!</h1>
      {/* <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img for="photo-upload" src={src} alt="Upload" />
        </div>
      </label> */}
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
      <h1>Create a Group</h1>
      {children}
      <button type="submit" className="styleBtn save">
        Save{" "}
      </button>
      <button className="btn" onClick={handleViewGroups}>
        {" "}
        Back{" "}
      </button>
    </form>
  </div>
);

class CreateGroup extends React.Component {
  state = {
    // imagePreviewUrl:
    //   "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    name: "",
    // bio: "",
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
    var string = "%";
    if (data.name.includes(string)) {
      Swal.fire(
        "Group name cannot contain a '%'.",
        " Please try again.",
        "warning"
      );
      return;
    }
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
            {/* <ImgUpload onChange={this.photoUpload} src={imagePreviewUrl} /> */}
            <GroupName onChange={this.editName} value={name} />
          </Edit>
        ) : (
          <Group
            onSubmit={this.handleSubmit}
            // src={imagePreviewUrl}
            name={name}
            // bio={bio}
          />
        )}
      </div>
    );
  }
}

export default CreateGroup;
