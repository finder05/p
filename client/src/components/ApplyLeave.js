import React, { useState } from "react";
import axios from "axios";

export default function ApplyLeave({ userId }) {
  const [form, setForm] = useState({
    type: "casual",
    from: "",
    to: "",
    reason: ""
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.from || !form.to || !form.reason) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/leave/apply", { ...form, userId });
      alert("✅ Leave Applied Successfully");
    } catch (err) {
      console.error(err.response?.data); // Shows detailed error in console
      alert(err.response?.data?.message || "❌ Error applying leave");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Apply for Leave</h3>
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="casual">Casual</option>
        <option value="medical">Medical</option>
      </select><br/>
      <input type="date" name="from" value={form.from} onChange={handleChange} /><br/>
      <input type="date" name="to" value={form.to} onChange={handleChange} /><br/>
      <textarea name="reason" placeholder="Reason" value={form.reason} onChange={handleChange}></textarea><br/>
      <button type="submit">Apply</button>
    </form>
  );
}
