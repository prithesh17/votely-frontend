import React, { useState } from "react";
import { Container, Typography, TextField, Button, Snackbar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;  

const CreateElection = () => {
  const [electionTitle, setElectionTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", party: "" }]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setCandidates(updatedCandidates);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, { name: "", party: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setErrorMessage("Start time must be earlier than end time.");
      return; 
    }

    try {
      const jwt = Cookies.get("accessToken");
      const response = await axios.post(
        `${apiUrl}/admin/createElection`,
        {
          electionTitle,
          startTime,
          endTime,
          candidates,
        },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Election created successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard"); 
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating election:", error);
      setErrorMessage("Failed to create election.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Election
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Election Title"
          variant="outlined"
          fullWidth
          required
          value={electionTitle}
          onChange={(e) => setElectionTitle(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <TextField
          label="Start Time"
          type="datetime-local"
          variant="outlined"
          fullWidth
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ marginBottom: "16px" }}
          InputLabelProps={{ shrink: true }} // Fixes placeholder overlap
        />
        <TextField
          label="End Time"
          type="datetime-local"
          variant="outlined"
          fullWidth
          required
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ marginBottom: "16px" }}
          InputLabelProps={{ shrink: true }} 
        />
        
        {candidates.map((candidate, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <TextField
              label="Candidate Name"
              variant="outlined"
              fullWidth
              required
              value={candidate.name}
              onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
              style={{ marginBottom: "8px" }}
            />
            <TextField
              label="Party"
              variant="outlined"
              fullWidth
              required
              value={candidate.party}
              onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
            />
          </div>
        ))}
        
        <Box display="flex" justifyContent="space-between" marginTop="16px">
          <Button variant="contained" color="primary" onClick={handleAddCandidate}>
            Add Candidate
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Create Election
          </Button>
        </Box>
      </form>

      <Snackbar
        open={Boolean(successMessage)} 
        autoHideDuration={3000} 
        onClose={() => setSuccessMessage("")} 
        message={successMessage}
      />

     
      <Snackbar
        open={Boolean(errorMessage)} 
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </Container>
  );
};

export default CreateElection;
