import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Box,
  Paper,
  IconButton,
  Alert,
  Stack,
  Divider,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const apiUrl = import.meta.env.VITE_API_URL;

const CreateElection = () => {
  const theme = useTheme();
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

  const handleRemoveCandidate = (index) => {
    if (candidates.length > 1) {
      const updatedCandidates = candidates.filter((_, i) => i !== index);
      setCandidates(updatedCandidates);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert IST string to UTC ISO string
    const start = new Date(`${startTime}:00+05:30`);
    const end = new Date(`${endTime}:00+05:30`);

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
          startTime: start.toISOString(), // UTC
          endTime: end.toISOString(),     // UTC
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}15)`,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate('/admin-dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            Create Election
          </Typography>
        </Box>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary }}>
              Election Details
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Election Title"
                variant="outlined"
                fullWidth
                required
                value={electionTitle}
                onChange={(e) => setElectionTitle(e.target.value)}
                sx={{ borderRadius: 1 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Time"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" color="text.primary">
                Candidates
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddCandidate}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Add Candidate
              </Button>
            </Box>

            <Stack spacing={3}>
              {candidates.map((candidate, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    background: theme.palette.grey[50],
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Grid container spacing={2} sx={{ flex: 1 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Candidate Name"
                          variant="outlined"
                          fullWidth
                          required
                          value={candidate.name}
                          onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Party"
                          variant="outlined"
                          fullWidth
                          required
                          value={candidate.party}
                          onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    {candidates.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveCandidate(index)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            Create Election
          </Button>
        </Box>
      </form>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateElection;