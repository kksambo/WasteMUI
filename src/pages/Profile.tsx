import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [btn, setBtn] = useState("");


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const userEmail = localStorage.getItem("userEmail"); 
      if(userEmail === "sambo@wastem.co.za"){
        setBtn("gotoAdminConsole");
      }else{
        setBtn("gotoUserConsole");
      }
      
      if (!userEmail) {
        setError("User not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://ledwaba-and-friends.onrender.com/api/AppUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const users = await response.json();
        const loggedInUser = users.find((u: any) => u.email === userEmail);

        if (!loggedInUser) {
          throw new Error("User not found.");
        }

        setUser(loggedInUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" style={{ maxWidth: "400px", margin: "20px auto" }}>
        <p>{error}</p>
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-primary me-2" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="btn btn-outline-success" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
    
  
  }


  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="main-container">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/profile">Profile</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dustbininteraction">Dispose</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link text-danger" href="#" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>


  <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      {user && (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Points:</strong> {user.points}</p>
        </div>
      )}

       
        <button 
         className="btn btn-primary"
        onClick={() => navigate(btn === "gotoAdminConsole" ? "/admin" : "/dustbininteraction")}>
        Go
      </button>
      
      </div>
      </div>
    
  );
};

export default Profile;