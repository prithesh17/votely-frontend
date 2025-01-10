import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box,
  Paper,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Papa from "papaparse";
import { styled } from '@mui/material/styles';

const apiUrl = import.meta.env.VITE_API_URL;

const Input = styled('input')({
  display: 'none',
});

const AddVoters = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, event) => {
    const values = [...emails];
    values[index] = event.target.value;
    setEmails(values);
  };

  const handleAddEmailField = () => {
    setEmails([...emails, ""]);
  };

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        const extractedEmails = results.data.flat().filter(email => email);
        setEmails(extractedEmails);
        setMessage(`${extractedEmails.length} email(s) extracted from CSV.`);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filteredEmails = emails.filter(email => email.trim() !== "");
    const jwt = Cookies.get("accessToken");
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/admin/addvoters`,
        {
          electionId,
          voters: filteredEmails,
        },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      if (response.data.success) {
        setMessage("Voters added successfully!");
        setEmails([""]);
        setCsvFile(null);
        navigate("/admin-dashboard");
      } else {
        setMessage("Failed to add voters.");
      }
    } catch (error) {
      console.error("Error adding voters:", error);
      setMessage("Error adding voters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Add Voters
        </Typography>
        
        {message && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography variant="h6" color="primary" sx={{ ml: 2 }}>
              Please wait, adding voters...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {emails.map((email, index) => (
                <TextField
                  key={index}
                  label="Voter Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(event) => handleInputChange(index, event)}
                  required
                  sx={{ backgroundColor: 'background.paper' }}
                />
              ))}

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddEmailField}
                      sx={{ minWidth: '120px' }}
                    >
                      Add More
                    </Button>
                    
                    <label htmlFor="csv-file">
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      <Button variant="outlined" component="span">
                        Choose CSV
                      </Button>
                    </label>
                    
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => csvFile && parseCsv(csvFile)}
                      disabled={!csvFile}
                    >
                      Upload CSV
                    </Button>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="large"
                    sx={{ height: '100%' }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default AddVoters;