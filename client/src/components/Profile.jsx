import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/profile.css';
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [allImage, setAllImage] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
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

    const handleClick = async () => {
        if (!image) {
            alert("Please Select Image");
            return;
        }

        const formData = new FormData();
        formData.append("image", image); 

        try {
            const token = localStorage.getItem("token");

            const uploadRes = await axios.post("http://localhost:5000/upload", 
                formData, 
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );

            const uploadedImageUrl = uploadRes.data.imageUrl; 

            setImageUrl(uploadedImageUrl);
            setAllImage((prevImages) => [...prevImages, uploadedImageUrl]); 
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    
                    <form encType="multipart/form-data">
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        <button type="button" onClick={handleClick}>Upload</button>
                    </form>

                    {imageUrl && (
                        <div>
                            <img src={imageUrl} alt="Uploaded" width="200px" />
                        </div>
                    )}

                    {allImage.length > 0 && (
                        <div>
                            <h3>All Uploaded Images:</h3>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {allImage.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="Uploaded"
                                        width="150px"
                                        style={{ margin: "10px" }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={() => { 
                        localStorage.removeItem("token"); 
                        navigate("/login"); 
                    }}>
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
