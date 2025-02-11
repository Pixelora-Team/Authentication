import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth/";

export const register = async (username, password) => {
    return await axios.post(`${API_URL}register`, { username, password });
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}login`, { username, password });
    if (!response.data.token) {
        throw new Error("Invalid credentials");
    }
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};
