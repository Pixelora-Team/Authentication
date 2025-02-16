import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/profile.css";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [allImage, setAllImage] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("https://authentication-backend-rwcp.onrender.com/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setUser(response.data);
                setAllImage(response.data.profilePics || []);
            } catch (error) {
                console.error("Error fetching profile:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const token = localStorage.getItem("token");

            const uploadRes = await axios.post(
                "http://localhost:5000/upload",
                formData,
                { headers: { Authorization:` Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            const uploadedImageUrl = uploadRes.data.imageUrl;

            setImageUrl(uploadedImageUrl);
            setAllImage((prevImages) => [...prevImages, uploadedImageUrl]);
            setFormVisible(false); 
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div id="mainprofile">
            <h1 id="header">Profile</h1>
            {user ? (
                <div id="usercontainer">
                    <h1><strong>Username:</strong> <span>{user.username}</span></h1>

                    {formVisible && (
                        <div id="model">
                            <div id="modelcontent">
                                <h3>Add User</h3>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} id="inputfile"/>
                                <br />
                                <div id="buttoncontainer">
                                    <button onClick={handleUpload} id="submit">Submit</button>
                                    <button onClick={() => setFormVisible(false)} id="cancle">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <hr id="hr"></hr>
                    
                    {allImage.length > 0 && (
                        <div>
                            <h3 id="uploadheader">Uploaded Images:</h3>
                            <div id="mainimagecontainer">
                                {allImage.map((img, index) => (
                                    <img key={index} src={img} alt="Uploaded" width="150px" style={{ margin: "10px" }} />
                                ))}
                                <span id="button"  onClick={() => setFormVisible(true)}>Upload Image</span>
                            </div>
                            
                        </div>
                    )}
                    

                   
                    <button id="logoutbutton" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                        Logout
                    </button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
