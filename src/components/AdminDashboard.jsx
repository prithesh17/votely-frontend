import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AnnouncementIcon from "@mui/icons-material/Announcement"; 
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 
import CreateIcon from "@mui/icons-material/Create"; 
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;  

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  const fetchElections = async () => {
    try {
      const jwt = Cookies.get("accessToken"); 
      const response = await axios.get(`${apiUrl}/admin/fetchElections`, {
        headers: {
          Authorization: jwt,
        },
      });
      setElections(response.data.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  const handleDeleteElection = async (electionId) => {
    try {
      const jwt = Cookies.get("accessToken");
      const response = await axios.post(
        `${apiUrl}/admin/deleteElection`,
        { electionId },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      if (response.data.success) {
        setElections((prevElections) => prevElections.filter((election) => election.electionId !== electionId));
      }
    } catch (error) {
      console.error("Error deleting election:", error);
    }
  };

  const handleAnnounceResults = (electionId) => {
    navigate(`/announceResults/${electionId}`);
  };

  const handleAddVoters = (electionId) => {
    navigate(`/addVoters/${electionId}`);
  };

  const handleCreateElection = () => {
    navigate("/createElection");
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateElection}
        style={{ marginBottom: "16px", borderRadius: "20px" }}
      >
        Create Election
      </Button>
      {elections.map((election) => (
        <Card key={election._id} variant="outlined" style={{ marginBottom: "16px" }}>
          <CardContent>
            <Typography variant="h5">{election.electionTitle}</Typography>
            <Typography color="textSecondary">Start Time: {new Date(election.startTime).toLocaleString()}</Typography>
            <Typography color="textSecondary">End Time: {new Date(election.endTime).toLocaleString()}</Typography>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteElection(election.electionId)}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<AnnouncementIcon />}
                onClick={() => handleAnnounceResults(election.electionId)}
              >
                Announce Results
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<PersonAddIcon />}
                onClick={() => handleAddVoters(election.electionId)}
              >
                Add Voters
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default AdminDashboard;
