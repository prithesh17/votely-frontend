import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { styled } from "@mui/system";

const apiUrl = import.meta.env.VITE_API_URL;  


const StyledCard = styled(Card)({
  marginBottom: "16px",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
  },
});

const AnnounceResults = () => {
  const { electionId } = useParams(); 
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const jwt = Cookies.get("accessToken"); 
        const response = await axios.post(
          `${apiUrl}/admin/announceResult`,
          { electionId }, 
          {
            headers: {
              Authorization: jwt,
            },
          }
        );

        if (response.data.success) {
          setResults(response.data.data);
          setMessage(response.data.message);
        } else {
          setMessage("Failed to fetch results.");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setMessage("Error fetching results.");
      } finally {
        setSnackbarOpen(true);
      }
    };

    fetchResults();
  }, [electionId]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginBottom: "16px", color: "#3f51b5" }}>
        Election Results
      </Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={message.includes("Error") ? "error" : "success"}>
          {message}
        </Alert>
      </Snackbar>
      <Grid container spacing={2}>
        {results.map((result, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard variant="outlined">
              <CardContent>
                <Typography variant="h5" style={{ color: "#1976d2" }}>{result.candidate}</Typography>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>Votes: {result.votes}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin-dashboard")}
        style={{ marginTop: "16px" }}
      >
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default AnnounceResults;
