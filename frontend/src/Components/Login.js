import React from 'react'
import './CSS/LoginCSS.css'
import logo from '../SPOT.svg'
import Swal from 'sweetalert2'

const ImgUpload = ({
    onChange,
    src
}) =>
    <div  >
        <img htmlFor="photo-upload" src={src} alt="SPOT LOGO" />
    </div>

const Email = ({
    onChange,
    value
}) =>
    <div className="field">
        <label htmlFor="username">
            Username:
        </label>
        <input
            id="username"
            type="text"
            onChange={onChange}
            maxlength="25"
            value={value}
            placeholder="username"
            required />
    </div>

const Password = ({
    onChange,
    value
}) =>
    <div className="field">
        <label htmlFor="password">
            Password:
        </label>
        <input
            id="password"
            type="password"
            onChange={onChange}
            maxlength="25"
            value={value}
            placeholder="password"
            required />
    </div>

const handleDevReg = () => {
    window.location.pathname = "/DevReg";
};

const Edit = ({
    onSubmit,
    children,
}) =>
    <div className="card">
        <form onSubmit={onSubmit}>
            {children}
            <div>
                <input type="checkbox" value="lsRememberMe" id="rememberMe" className='checkbox' />
                <label for="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="login-btn">Login </button>
            <button className="signup-btn" onClick={handleDevReg}>Sign up</button>
        </form>
    </div>

const Profile = ({
    onSubmit,
    email,
    password,
}) =>
    <div className="card">
        <form onSubmit={onSubmit}>
            <h1>Successfully Logged in</h1>
            <div className="email">{email}</div>
            <div className="password">{password}</div>
        </form>
    </div>


class Login extends React.Component {
    state = {
        email: '',
        password: '',
        active: 'edit',
    }

    editEmail = e => {
        const email = e.target.value;
        this.setState({
            email,
        });
    }

    editPassword = e => {
        const password = e.target.value;
        this.setState({
            password,
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        let data = this.state;
        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic' + btoa(data.email + ":" + data.password)},
            body: JSON.stringify({
                'username': data.email,
                'password': data.password,
            }),
        }
        async function fetchFunc() {
            return await fetch('http://127.0.0.1:5000/login', requestOpt)
                .then(response => response.json())
                .catch(error => console.log(error));
        }
        (async () => {
            let info = await fetchFunc();
            if (info.success) { // correct login info
                sessionStorage.setItem("token", info.token);
                localStorage.setItem("isAuthenticated", true);
                window.location.pathname = "/";
            } else {
                // alert(info.msg);
                Swal.fire(
                    info.msg,
                    'Try again!',
                    'Warning',
                  )

            }
        })()
    }

    render() {
        const {
            email,
            password,
            active } = this.state;

        return (
            <div className='login-screen'>
                {(active === 'edit') ? (
                    <Edit onSubmit={this.handleSubmit}>
                        <ImgUpload src={logo} className="loginimg" />
                        <Email onChange={this.editEmail} value={email} />
                        <Password onChange={this.editPassword} value={password} />
                    </Edit>
                ) : (
                    <Profile
                        onSubmit={this.handleSubmit}
                        email={email}
                        password={password}
                    />)}

            </div>
        )
    }
}
// ReactDOM.render(
//     <>
//         <Login />
//     </>
//     ,
//     document.getElementById('root')
// )

export default Login;