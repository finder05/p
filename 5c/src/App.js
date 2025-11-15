import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; 
function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const submitSurvey = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/submit", { answers });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  if (submitted) {
    return <h2 style={{ textAlign: "center" }}>Thank you for your submission!</h2>;
  }

  return (
    <div style={{ width: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Survey</h1>

      <form onSubmit={submitSurvey}>
        {questions.map((q) => (
          <div key={q._id} style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "18px" }}>
              {q.question}
              <br />
            </label>
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleChange(q._id, e.target.value)}
              placeholder="Type your answer..."
              required
              style={{ padding: "8px", width: "100%" }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            background: "blue",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}

export default App;
