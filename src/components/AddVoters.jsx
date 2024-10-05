import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Papa from "papaparse";

const apiUrl = import.meta.env.VITE_API_URL;  


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
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Voters
      </Typography>
      {message && <Typography variant="h6">{message}</Typography>}
      
      {loading ? (
        <Typography variant="h6" style={{ color: "blue" }}>
          Please wait, adding voters...
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          {emails.map((email, index) => (
            <Grid container spacing={2} key={index} alignItems="center" style={{ marginBottom: "16px" }}>
              <Grid item xs={12}>
                <TextField
                  label="Voter Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(event) => handleInputChange(index, event)}
                  required
                />
              </Grid>
            </Grid>
          ))}
          <Grid container spacing={2} style={{ marginTop: "16px" }}>
            <Grid item xs={12} md={8}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEmailField}
                style={{ marginRight: "8px" }} 
              >
                Add More
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ marginLeft: "8px" }} 
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => csvFile && parseCsv(csvFile)} 
                style={{ marginLeft: "8px" }} 
              >
                Upload CSV
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                fullWidth 
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default AddVoters;
