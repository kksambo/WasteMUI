import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DustbinInteraction.css";
import binOpeningGif from "./binGif.gif"; // Import the bin opening GIF

interface Bin {
  id: number;
  binCode: string;
  location: string;
  availability: string;
  capacity: number;
  currentWeight: number;
}

const DustbinInteraction = () => {
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [classificationResult, setClassificationResult] = useState<string | null>(null);
  const [binOpen, setBinOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  
  useEffect(() => {
    fetch("https://ledwaba-and-friends.onrender.com/api/smartbins")
      .then((res) => res.json())
      .then((data) => {
        setBins(data);
      })
      .catch((err) => {
        setError("Failed to fetch bins");
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!itemImage || !selectedBin) {
      alert("Please select a bin and an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setClassificationResult(null);
    setRewardMessage(null);

    const formData = new FormData();
    formData.append("file", itemImage);

    try {
      
      const response = await fetch("https://geminiapp-dp6r.onrender.com/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify the item. Please try again.");
      }

      const result = await response.json();
      console.log(result);

      if (result.classification !== "Unknown") {
        setBinOpen(true);
        setTimeout(() => setBinOpen(false), 5000);
        setClassificationResult(`Item accepted: ${result.classification}`);

     
        await updateBinWeight();
        await rewardUser();
      } else {
        setClassificationResult("Item rejected: Unknown item.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setItemImage(null);
    }
  };

  const updateBinWeight = async () => {
    if (!selectedBin) return;

    try {
      const updatedBin = { ...selectedBin, currentWeight: selectedBin.currentWeight + 1 }; 
      await fetch(`https://ledwaba-and-friends.onrender.com/api/smartbins/${selectedBin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBin),
      });

     
      setBins(bins.map(bin => bin.id === selectedBin.id ? updatedBin : bin));
    } catch (err) {
      setError("Failed to update bin weight.");
    }
  };

  const rewardUser = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("User email not found. Please log in again.");
      }

      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/givePoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserEmail: userEmail,
          Points: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reward points. Please try again.");
      }

      const data = await response.json();
      setRewardMessage(`You got yourself 10 points!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBinSelect = (bin: Bin) => {
    setSelectedBin(bin); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBins = bins.filter(bin =>
    bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/"); 
  };

  return (
    <div className="dustbin-interaction">
      <nav className="navbar navbar-expand-lg navbar-dark px-4">
        <Link className="navbar-brand" to="#">Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
              <Link className="nav-link text-danger" to="#" onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>

      <center>
        <h2>Dustbin Interaction</h2>
        <div className="image-upload">
          <label htmlFor="item-image">Take a picture or select from storage:</label>
          <input
            type="file"
            id="item-image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Processing..." : "Deposit Item"}
        </button>

        {binOpen && (
          <div className="bin-animation">
            <img src={binOpeningGif} alt="Bin Opening" />
          </div>
        )}

        {classificationResult && (
          <div className="classification-result">
            <p>{classificationResult}</p>
          </div>
        )}

        {rewardMessage && (
          <div className="reward-message">
            <p>{rewardMessage}</p>
          </div>
        )}

        {error && <p className="error">Error: {error}</p>}
      </center>

      {/* Search for bins by location */}
      <div className="search-bin">
        <input
          type="text"
          placeholder="Search by Location"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
        />
      </div>

      {/* Display bins in a scrollable table */}
      <div className="bin-list mt-5">
        <h3>Available Bins</h3>
        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Bin Code</th>
                <th>Location</th>
                <th>Capacity (kg)</th>
                <th>Current Weight (kg)</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin) => (
                <tr key={bin.id}>
                  <td>{bin.binCode}</td>
                  <td>{bin.location}</td>
                  <td>{bin.capacity}</td>
                  <td>{bin.currentWeight}</td>
                  <td>{bin.availability}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBinSelect(bin)}
                    >
                      {selectedBin?.id === bin.id ? "Selected" : "Choose Bin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DustbinInteraction;
