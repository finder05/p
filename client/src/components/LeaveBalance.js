import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveBalance({ userId }) {
  const [balance, setBalance] = useState({ casual: 5, medical: 10 });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => setBalance(res.data.availableLeaves))
      .catch(console.error);
  }, [userId]);

  return (
    <div>
      <h3>Leave Balance</h3>
      <p>Casual Leaves: {balance.casual}</p>
      <p>Medical Leaves: {balance.medical}</p>
    </div>
  );
}
