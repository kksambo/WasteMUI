import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Bin {
  id: number;
  binCode: string;
  location: string;
  availability: string;
  capacity: number;
  currentWeight: number;
}

const BinManagement = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [editLocation, setEditLocation] = useState("");
  const [editCapacity, setEditCapacity] = useState<number>(0);

  const tableRef = useRef<HTMLTableElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://ledwaba-and-friends.onrender.com/api/smartbins")
      .then((res) => res.json())
      .then((data) => {
        setBins(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch bins");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const row = tableRef.current?.querySelector(`tr[data-id="${e.target.value}"]`);
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const filteredBins = bins.filter((bin) =>
    bin.id.toString().includes(searchTerm.trim())
  );

  const handleEdit = (binId: number) => {
    const bin = bins.find((b) => b.id === binId);
    if (bin) {
      setEditingBin(bin);
      setEditLocation(bin.location);
      setEditCapacity(bin.capacity);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingBin) return;

    try {
      const response = await fetch(
        `https://ledwaba-and-friends.onrender.com/api/smartbins/${editingBin.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: editLocation,
            capacity: editCapacity,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update bin");

      setBins((prev) =>
        prev.map((bin) =>
          bin.id === editingBin.id
            ? { ...bin, location: editLocation, capacity: editCapacity }
            : bin
        )
      );

      setEditingBin(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this bin?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://ledwaba-and-friends.onrender.com/api/smartbins/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete bin");

      setBins((prev) => prev.filter((bin) => bin.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="containers">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="#">Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/addbin">Add Bin</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-danger" href="#" onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center home-header mb-4">
        <h1>Bin Management</h1>
        <p className="lead">Manage and monitor smart bins</p>
      </div>

      {/* Search */}
      <div className="container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Bin ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="container my-5">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "scroll" }}>
          <table ref={tableRef} className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Capacity</th>
                <th>Weight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin) => (
                <tr key={bin.id} data-id={bin.id}>
                  <td>{bin.id}</td>
                  <td>{bin.binCode}</td>
                  <td>{bin.location}</td>
                  <td>{bin.availability}</td>
                  <td>{bin.capacity} kg</td>
                  <td>{bin.currentWeight} kg</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(bin.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bin.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBin && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Bin #{editingBin.id}</h5>
                <button className="btn-close" onClick={() => setEditingBin(null)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Capacity (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingBin(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-muted mt-5 mb-3">
        &copy; 2025 LedwabaAndFriends. All rights reserved.
      </footer>
    </div>
  );
};

export default BinManagement;
