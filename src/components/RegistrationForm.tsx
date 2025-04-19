import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !phone) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/AppUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          email: email,
          password: password,
          phoneNumber: phone,
          Role: "disposalMember",
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      setSuccess("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="#">SignUp Page</Link>
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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      <center>
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="login-actions">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </form>
      </center>
    </div>
  );
};

export default RegistrationForm;
