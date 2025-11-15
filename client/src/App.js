import React, { useState, useCallback } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: "casual", from: "", to: "", reason: "" });

  // Fetch leaves for a user
  const fetchLeaves = useCallback(async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/${userId}`);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch or create user by username
  const fetchUser = useCallback(async () => {
    if (!username) return alert("Enter a username");
    try {
      const res = await axios.get(`http://localhost:5000/api/users?name=${username}`);
      setUser(res.data);
      fetchLeaves(res.data._id); // now included dependency
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching user");
    }
  }, [username, fetchLeaves]);

  // Handle form change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Apply leave
  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return alert("Select a user first");
    if (!form.from || !form.to || !form.reason) return alert("Fill all fields");

    try {
      const res = await axios.post("http://localhost:5000/api/leave/apply", { userId: user._id, ...form });
      alert(res.data.message);
      setForm({ type: "casual", from: "", to: "", reason: "" });
      fetchUser();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error applying leave");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Leave Management System</h1>

      {/* User Section */}
      <div style={{ marginBottom: "30px" }}>
        <label>Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={fetchUser} style={{ marginLeft: "10px" }}>
          Load / Create User
        </button>
      </div>

      {user && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Leave Balance for {user.name}</h2>
          <p>Casual Leaves: {user.availableLeaves.casual}</p>
          <p>Medical Leaves: {user.availableLeaves.medical}</p>
        </div>
      )}

      {/* Apply Leave */}
      {user && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Apply for Leave</h2>
          <form onSubmit={handleApply}>
            <div>
              <label>Type: </label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="casual">Casual</option>
                <option value="medical">Medical</option>
              </select>
            </div>
            <div>
              <label>From: </label>
              <input type="date" name="from" value={form.from} onChange={handleChange} required />
            </div>
            <div>
              <label>To: </label>
              <input type="date" name="to" value={form.to} onChange={handleChange} required />
            </div>
            <div>
              <label>Reason: </label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} required />
            </div>
            <button type="submit" style={{ marginTop: "10px" }}>
              Apply
            </button>
          </form>
        </div>
      )}

      {/* Leave List */}
      {user && (
        <div>
          <h2>My Leaves</h2>
          {leaves.length === 0 ? (
            <p>No leaves applied yet.</p>
          ) : (
            <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.from).toLocaleDateString()}</td>
                    <td>{new Date(leave.to).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
