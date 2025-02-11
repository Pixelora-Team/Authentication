import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
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
