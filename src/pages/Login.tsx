import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate for navigation
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store the token and email in localStorage
      localStorage.setItem("token", data.Token);
      localStorage.setItem("userEmail", email); // Store the email

      // Redirect to DustbinInteraction page
      if (email === "sambo@wastem.co.za") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setResetMessage("Please enter your email.");
      return;
    }

    // Simulate API call
    setResetMessage("If this email exists, a reset link has been sent.");
  };

  return (
    <div className="login-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="#">Login Page</Link>
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
              <Link className="nav-link text-danger" to="/register">Register</Link>
            </li>
          </ul>
        </div>
      </nav>

      <center>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <div className="login-actions">
          <Link to="/" className="btn btn-secondary">
            Go Back Home
          </Link>
          <button type="button" className="btn btn-link" onClick={() => setShowForgotPasswordModal(true)}>
            Forgot Password?
          </button>
        </div>
      </center>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button className="btn-close" onClick={() => setShowForgotPasswordModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                {resetMessage && <div className="alert alert-info">{resetMessage}</div>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForgotPasswordModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleForgotPassword}>Send Reset Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
