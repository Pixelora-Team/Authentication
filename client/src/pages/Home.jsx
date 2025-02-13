import { Link } from "react-router-dom";
import './Home.css';
import auth from './auth2.jpg'

const Home = () => {
    return (
    <div id="main">
        <img src={auth} alt="authentication" id="image1"/>
        <div id="container">
            <h1>Welcome , <br></br>to the Authentication App</h1>
            <div id="pbutcontainer">
                <p>Please login or register to continue.</p>
                <div id="buttons">
                     <Link to="/login">
                          <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
                    </Link>
                    <Link to="/register">
                           <button style={{ margin: "10px", padding: "10px 20px" }}>Register</button>
                     </Link>
                 </div>
            </div>
        </div>
    </div>
    );
};

export default Home;
