import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/profile.css';
import axios from "axios"; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
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
            } catch (error) {
                console.error("Error fetching profile:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleUpload = async () => {
        if (images.length === 0) return;

        const formData = new FormData();
        images.forEach(image => formData.append("profilePics", image));

        const token = localStorage.getItem("token");
        
        try {
            const response = await axios.post("http://localhost:5000/api/auth/upload", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            setUser(prevUser => ({ ...prevUser, profilePics: response.data.profilePics }));
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };


    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    
                    <div>
                        <h3>Uploaded Images</h3>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {user.profilePics?.map((pic, index) => (
                                <img key={index} src={`http://192.168.43.246:5000${pic}`} alt="Profile" style={{ width: 100, height: 100, borderRadius: "10px" }} />
                            ))}
                        </div>
                    </div>

                    <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                    
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {previews.map((preview, index) => (
                            <img key={index} src={preview} alt="Preview" style={{ width: 100, height: 100, borderRadius: "10px" }} />
                        ))}
                    </div>

                    <button onClick={handleUpload}>Upload</button>
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
