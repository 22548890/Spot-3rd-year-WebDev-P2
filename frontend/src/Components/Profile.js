import React from "react";
import Swal from "sweetalert2";
// import "./CSS/DevRegCSS.css";

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img htmlFor="photo-upload" src={src} alt="profile" />
    </div>
    <input id="photo-upload" type="file" onChange={onChange} />
  </label>
);

const Username = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="name">Username:</label>
    <input
      id="name"
      type="text"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="Alexa"
      required
    />
  </div>
);

const Email = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="email">Email:</label>
    <input
      id="email"
      type="email"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="jbloggs@mail.com"
      required
    />
  </div>
);

const Password = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="password">Password:</label>
    <input
      id="password"
      type="password"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="password"
      required
    />
  </div>
);

const handleHome = (e) => {
  e.preventDefault();
  window.location.pathname = "/";
};

const Edit = ({ onSubmit, children }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Edit Profile Details</h1>
      {children}
      <button type="submit" className="styleBtn save">
        Save & Exit{" "}
      </button>
      <button className="btn" onClick={handleHome}>
        {" "}
        Back Home
      </button>
    </form>
  </div>
);

class EditDevProfile extends React.Component {
  state = {
    file: "",
    imagePreviewUrl:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    username: "",
    email: "",
    password: "",
  };

  photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  editUsername = (e) => {
    const username = e.target.value;
    this.setState({
      username,
    });
  };

  editEmail = (e) => {
    const email = e.target.value;
    this.setState({
      email,
    });
  };

  editPassword = (e) => {
    const password = e.target.value;
    this.setState({
      password,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let data = this.state;
    const requestOpt = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.username,
        password: data.password,
        email: data.email,
        open_to_contracts: true,
      }),
    };
    async function fetchFunc() {
      return await fetch("http://127.0.0.1:5000/devEdit", requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      let info = await fetchFunc();
      if (info.success) {
        window.location.pathname = "/";
      } else {
        Swal.fire(info.msg, "Try again!", "warning");
      }
    })();
  };

  render() {
    const {
      imagePreviewUrl,
      username,
      email,
      password,
    } = this.state;
    return (
      <div>
        <Edit onSubmit={this.handleSubmit}>
          <ImgUpload onChange={this.photoUpload} src={imagePreviewUrl} />
          <Username onChange={this.editUsername} value={username} />
          <Email onChange={this.editEmail} value={email} />
          <Password onChange={this.editPassword} value={password} />
        </Edit>
      </div>
    );
  }
}

export default EditDevProfile;
