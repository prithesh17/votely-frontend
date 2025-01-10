import React, { useEffect, useState } from "react";
import { 
  Button, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Box,
  IconButton,
  Divider,
  Paper,
  useTheme,
  Tooltip,
  CardActions,
  CardHeader,
  Stack
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const theme = useTheme();
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
        setElections((prevElections) => 
          prevElections.filter((election) => election.electionId !== electionId)
        );
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}15)`,
          borderRadius: 2
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateElection}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            Create New Election
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {elections.map((election) => (
          <Grid item xs={12} key={election._id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {election.electionTitle}
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Stack spacing={1}>
                  <Typography color="text.secondary">
                    <strong>Start Time:</strong> {new Date(election.startTime).toLocaleString()}
                  </Typography>
                  <Typography color="text.secondary">
                    <strong>End Time:</strong> {new Date(election.endTime).toLocaleString()}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Add Voters">
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleAddVoters(election.electionId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Add Voters
                    </Button>
                  </Tooltip>
                  <Tooltip title="Announce Results">
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<AnnouncementIcon />}
                      onClick={() => handleAnnounceResults(election.electionId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Announce Results
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete Election">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteElection(election.electionId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;