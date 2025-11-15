import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveList({ userId }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/leaves/${userId}`)
      .then(res => setLeaves(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div>
      <h3>My Leaves</h3>
      <ul>
        {leaves.map(l => (
          <li key={l._id}>
            {l.type} Leave from {new Date(l.from).toLocaleDateString()} to {new Date(l.to).toLocaleDateString()} — {l.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
