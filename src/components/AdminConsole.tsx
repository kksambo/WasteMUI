import React, { useState, useEffect, useRef } from "react";
import "./AdminConsole.css"; // Ensure CSS is appropriately styled
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  points: number;
  amount: number;
}

function AdminConsole() {
  // State hooks
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null); 

  // Refs
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Fetch data inside useEffect
  useEffect(() => {
    fetch("https://ledwaba-and-friends.onrender.com/api/AppUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once on mount

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      scrollToUser(event.target.value); // Scroll to user if ID is typed
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.id.toString().includes(searchTerm.toLowerCase())
  );

  // Scroll to the user when found
  const scrollToUser = (userId: string) => {
    const row = tableRef.current?.querySelector(`tr[data-id="${userId}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Handle user actions
  const handleView = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleEdit = (userId: number) => {
    console.log("Editing user with ID: " + userId);
  };

  const handleRemove = (userId: number) => {
    console.log("Removing user with ID: " + userId);
    const isConfirmed: boolean = window.confirm("Are you sure you want to delete this user?");
if(isConfirmed){
  
    // Make a DELETE request to the API to remove the user
    fetch(`https://ledwaba-and-friends.onrender.com/api/deleteUser/${userId}`, {
      method: 'DELETE', // HTTP method for delete
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
  
        // If successful, update the local users state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        
        console.log("User deleted successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleLogout = (e) => {
    e.preventDefault();  // Prevent default behavior of anchor tag
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');  // Redirect to the homepage after logout
  };

  return (
    <div className="containers">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="#">Admin Panel</Link>
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
            <Link className="nav-link" to="/bin">Bins</Link>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-danger"
              href="#"
              onClick={handleLogout} // Handle logout functionality
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>

      <div className="text-center home-header mb-4">
        <h1>Admin Console</h1>
        <p className="lead">Manage users, view detailed info, and track activities</p>
      </div>

      {/* Search Box */}
      <div className="container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by User ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User Management Table */}
      <div className="container my-5">
        <h2 className="text-center text-primary mb-4">User Management</h2>
        <div className="table-responsive" style={{ maxHeight: "700px", overflowY: "scroll" }}>
          <table ref={tableRef} className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user.id} data-id={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleView(user.id)}>
                      View
                    </button>
                    <button className="btn btn-warning btn-sm mx-2" onClick={() => handleEdit(user.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(user.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="modal fade show" id="userModal" tabIndex={-1} aria-labelledby="userModalLabel" aria-hidden="true" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="userModalLabel">User Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedUser(null)} // Close the modal
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>User ID:</strong> {selectedUser.id}</p>
                <p><strong>Username:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedUser(null)} // Close the modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      <footer>
        &copy; 2025 LedwabaAndFriends. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminConsole;
