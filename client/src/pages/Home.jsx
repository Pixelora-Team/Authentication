import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Welcome to the Authentication App</h1>
            <p>Please login or register to continue.</p>
            <div style={{ marginTop: "20px" }}>
                <Link to="/login">
                    <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
                </Link>
                <Link to="/register">
                    <button style={{ margin: "10px", padding: "10px 20px" }}>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
