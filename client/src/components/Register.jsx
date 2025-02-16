import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './css/register.css';
import image from './images/registermain.jpg';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const register = async (username, password) => {
        return await axios.post('https://authentication-backend-rwcp.onrender.com/api/auth/register', { username, password });
    };

    const handleRegister = async () => {
        try {
            await register(username, password);
            alert("Registered successfully!");
            navigate("/login");
        } catch (error) {
            alert("Registration failed!");
        }
    };

    return (
        <div id="mainregister">
                
                <div id="registercontainer">
                    <h1>Register</h1>
                    <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    
                    <button onClick={handleRegister}>Register</button>
                    <p onClick={() => {navigate('/login')}}>Already Have an account</p>
                </div>
                <img src={image} alt="register" />
        </div>
    );
};

export default Register;
