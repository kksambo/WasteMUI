import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddBin = () => {
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code || !location || !availability || !capacity) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/smartbins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          binCode: code,
          location,
          availability,
          capacity,
          currentWeight: 0 // Optional: default value if supported
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register bin. Please try again.");
      }

      setSuccess("Bin registered successfully!");
      setCode("");
      setLocation("");
      setAvailability("");
      setCapacity(0);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="#">Admin Panel</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bins">Bins</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-danger" href="#" onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Form */}
      <center>
        <h2>Add New Bin</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          <div className="form-group">
            <label>Bin Code</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Availability</label>
            <input
              type="text"
              className="form-control"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity (kg)</label>
            <input
              type="number"
              className="form-control"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>

          <div className="login-actions mt-3">
            <button type="submit" className="btn btn-primary">Add Bin</button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/bin")}
            >
              Back to Bin Management
            </button>
          </div>
        </form>
      </center>
    </div>
  );
};

export default AddBin;
