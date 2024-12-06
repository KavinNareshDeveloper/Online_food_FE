import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import '../styles/filter.css';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'whitesmoke',
        textAlign: 'center',
        padding:'75px'
    }
};


const Header = () => {
    const location = useLocation();

    const [background, setBackground] = useState('red');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalAnOpen, setModalAnOpen] = useState(false);
    const [login, setLogin] = useState(false)
    const [username, setUsername] = useState("")
    const [pic, setPic] = useState("");
    const [logUser, setLogUser] = useState([]);
    const [signUser, setSignUser] = useState([])
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [pass, setPass] = useState("")

    useEffect(() => {
        if (location.pathname === '/') {
            setBackground('rgba(165, 42, 42, 0.9)');
        } else {
            setBackground('rgb(236, 15, 107)')
        }
    }, [location.pathname])

    const Modalopen = () => {   //SignIn
        setModalIsOpen(true)
    }

    const ModalAnopen = () => { //SignUP
        setModalAnOpen(true)
    }

    const ModalClose = () => { 
        setModalIsOpen(false)
    }

    const ModalAnClose = () => {
        setModalAnOpen(false)
    }

    const isLoggedout = () => {
        googleLogout();
        setLogin(false);
        sessionStorage.clear()
    }

    const responseGoogle = (response) => {
        setLogin(true);
        var decode = jwtDecode(response.credential)
        setUsername(decode.given_name)
        setPic(decode.picture)
        console.log(decode)
    }

    const loggedInApi = (e) => {
        e.preventDefault();
        const data = {
            email: mail,
            password: pass
        }
        axiosClient.post(`/komato/loginUser`, data)
            .then((res) => {
                setLogin(true)
                sessionStorage.setItem("user", res.data.user.username);
                setLogUser(res.data.user);
                setUsername( res.data.user.username);
                console.log(logUser, 'login success');
                console.log('Login success:', res.data.user);
            })
            .catch(err => err, 'loginfailed')

            ModalClose()
    }

    const signinApi = () => {
        const data = {
            username: name,
            email: mail,
            password: pass
        }
        axiosClient.post(`/komato/postUser`, data)
            .then(res => setSignUser(res.data),
                console.log(signUser, 'signin success'),
            )
            .catch(err => err, 'signinfailed')
            ModalAnClose();
    }

    const targetName = (e) => {
        setName(e.target.value)
    }

    const targetMail = (e) => {
        setMail(e.target.value)
    }

    const targetPass = (e) => {
        setPass(e.target.value)
    }

    const clearForm = () => {
        setName('');
        setMail('');
        setPass('');
    }
    

    return (
        <div>

            {!login ? (<div class="container-fluid head" style={{ backgroundColor: background }}>
                <div class="box">K</div>

                <button class="btn btn-outline-danger text-white" onClick={Modalopen}>SignIn</button>
                <button class="btn btn-outline-danger text-white mx-2" onClick={ModalAnopen}>SignUp</button>
               </div>) :
                (<div class="container-fluid head" style={{ backgroundColor: background }}>
                    <div class="box">K</div>
                    <img src={pic} alt="my img" height={"50px"} width={"50px"} style={{ borderRadius: "50%", marginTop: "18px" }} />
                    <button class="btn btn-outline-danger text-white">{username}</button>
                    <button class="btn btn-outline-danger text-white mx-2" onClick={isLoggedout}>SignOut</button>
                </div>)
            }

          {/* SIGNIN MODAL*/}

            <Modal id='login' isOpen={modalIsOpen} style={customStyles}>
                <form onSubmit={loggedInApi} className="signin-form">
                    <h1 className="form-title">Sign In</h1>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" value={mail} onChange={targetMail} className="form-input" placeholder="Enter a valid Email"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" value={pass} onChange={targetPass} className="form-input" placeholder="Enter Password"/>
                    </div>

                    <button type="submit" className="btn-signin">
                        Sign In
                    </button>
                    
                    <div className="google-login-container">
                        <GoogleOAuthProvider clientId="209684594392-f0cktup9hh1i85a03jfjmp7u18g7bnti.apps.googleusercontent.com">
                            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} redirectUri="http://localhost:3000"/>
                        </GoogleOAuthProvider>
                    </div>

                    <button type="button" className="btn-close"  onClick={ModalClose}>
                        Cancel
                    </button>

                    <button type="button" className="btn-clear"  onClick={clearForm}>
                        Clear
                    </button>
                </form>
            </Modal>

             {/* SIGNUP MODAL */}

            <Modal isOpen={modalAnOpen} style={customStyles}>
            <form onSubmit={signinApi} className="form-container">
                <h1 className="form-title">Sign Up</h1>

                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input type="text" id="username" onChange={targetName} value={name} className="form-input" placeholder="Enter a name"/>
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" onChange={targetMail} value={mail} className="form-input" placeholder="Enter a valid Email"/>
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password"id="password" onChange={targetPass} value={pass} className="form-input" placeholder="Enter Password"/>
                </div>

                <div className="form-footer">
                    <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => { Modalopen(); ModalAnClose(); }}>
                        Already Have an Account?
                    </div>

                    <button type="submit" className="btn-submit" style={{ backgroundColor: 'lightgreen', color: 'green' }}>
                        Submit
                    </button>

                    <button type="button" className="btn-close" style={{ backgroundColor: 'lightgreen', color: 'green' }} onClick={ModalAnClose}>
                        Cancel
                    </button>

                    <button type="button" className="btn-clear" style={{ backgroundColor: 'lightgreen', color: 'green' }}onClick={clearForm}>
                        Clear
                    </button>
                </div>
            </form>
            </Modal>
        </div>
    )
}

export default Header;
