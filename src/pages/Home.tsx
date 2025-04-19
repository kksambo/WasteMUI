import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    
    navigate("/"); 
  };

  return (
    <div className="home-container">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Home Page</Link>
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
            <Link className="nav-link" to="/profile">Profile</Link>
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
      <div className="home-header">
        <h1>Welcome to the Trash Management System</h1>
        <p className="lead">
          Manage waste efficiently with smart dustbins and IoT technology.
        </p>
      </div>
      <div className="home-features">
        <h2>Features</h2>
        <ul>
          <li>User Registration</li>
          <li>Smart Dustbin Interaction</li>
          <li>Data Transmission using IoT Technology</li>
          <li>Rewards for Waste Disposal</li>
        </ul>
      </div>
      <div className="home-actions">
        <h2>Get Started</h2>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
        <Link to="/login" className="btn btn-secondary ml-2">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;