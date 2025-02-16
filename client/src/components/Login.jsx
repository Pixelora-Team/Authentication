import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './css/login.css';
import image from './images/login2.png';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const API_URL = "https://authentication-backend-rwcp.onrender.com/api/auth/";

    const login = async (username, password) => {
    const response = await axios.post(`${API_URL}login`, { username, password });
    if (!response.data.token) {
        throw new Error("Invalid credentials");
    }
    localStorage.setItem("token", response.data.token);
    return response.data;
};

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            console.log("Login successful, data received:", data); 
            if (data.token) {
                alert(`Welcome ${data.username}`);
                navigate("/profile");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
        }
    };
    
    return (
        <div id="mainlogin">
            <img src={image} alt="login" />
            <div id="logincontainer">
                <h1>Login</h1>
                <input 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    id="name"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    id="password"
                />
                <button onClick={handleLogin}>Login</button>
                <p onClick={() => {
                    navigate('/register')
                }}>Don't have an account</p>

            </div>
        </div>
    );
};

export default Login;
