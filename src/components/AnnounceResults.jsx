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
 Box,
 Paper,
 CircularProgress,
 useTheme
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { styled } from "@mui/material/styles";

const apiUrl = import.meta.env.VITE_API_URL;

const StyledCard = styled(Card)(({ theme }) => ({
 height: '100%',
 display: 'flex',
 flexDirection: 'column',
 transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
 '&:hover': {
   transform: 'translateY(-8px)',
   boxShadow: theme.shadows[8],
 },
 backgroundColor: theme.palette.background.paper,
 borderRadius: theme.shape.borderRadius * 2,
}));

const ResultCardContent = styled(CardContent)(({ theme }) => ({
 flex: 1,
 padding: theme.spacing(3),
 display: 'flex',
 flexDirection: 'column',
 gap: theme.spacing(2),
}));

const AnnounceResults = () => {
 const theme = useTheme();
 const { electionId } = useParams();
 const [results, setResults] = useState([]);
 const [message, setMessage] = useState("");
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [loading, setLoading] = useState(true);
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
         setMessage(response.data.message || "Results fetched successfully.");
       } else {
         setMessage("Failed to fetch results.");
       }
     } catch (error) {
       console.error("Error fetching results:", error);
       setMessage("Error fetching results.");
     } finally {
       setLoading(false);
       setSnackbarOpen(true);
     }
   };
   fetchResults();
 }, [electionId]);

 const handleCloseSnackbar = () => {
   setSnackbarOpen(false);
 };

 if (loading) {
   return (
     <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
       <CircularProgress size={60} thickness={4} />
     </Box>
   );
 }

 return (
   <Container maxWidth="lg" sx={{ py: 4 }}>
     <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
       <Typography
         variant="h3"
         gutterBottom
         sx={{
           mb: 4,
           fontWeight: 600,
           background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
           backgroundClip: 'text',
           WebkitBackgroundClip: 'text',
           color: 'transparent',
           textAlign: 'center'
         }}
       >
         Election Results
       </Typography>

       <Grid container spacing={3}>
         {results.map((result, index) => (
           <Grid item xs={12} sm={6} md={4} key={index}>
             <StyledCard>
               <ResultCardContent>
                 <Typography 
                   variant="h5" 
                   sx={{
                     color: theme.palette.primary.main,
                     fontWeight: 600,
                     mb: 2
                   }}
                 >
                   {result.candidate}
                 </Typography>
                 <Box
                   sx={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     p: 2,
                     bgcolor: theme.palette.primary.light,
                     borderRadius: 2,
                   }}
                 >
                   <Typography 
                     variant="h4" 
                     sx={{ 
                       fontWeight: 'bold',
                       color: theme.palette.primary.contrastText
                     }}
                   >
                     {result.votes}
                   </Typography>
                   <Typography 
                     variant="subtitle1"
                     sx={{ 
                       ml: 1,
                       color: theme.palette.primary.contrastText
                     }}
                   >
                     votes
                   </Typography>
                 </Box>
               </ResultCardContent>
             </StyledCard>
           </Grid>
         ))}
       </Grid>

       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
         <Button
           variant="contained"
           color="primary"
           size="large"
           onClick={() => navigate("/admin-dashboard")}
           sx={{
             px: 4,
             py: 1.5,
             borderRadius: 2,
             textTransform: 'none',
             fontSize: '1.1rem',
             fontWeight: 500,
             boxShadow: theme.shadows[4],
             '&:hover': {
               boxShadow: theme.shadows[8],
             }
           }}
         >
           Back to Dashboard
         </Button>
       </Box>
     </Paper>

     <Snackbar
       open={snackbarOpen}
       autoHideDuration={6000}
       onClose={handleCloseSnackbar}
       anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
     >
       <Alert
         onClose={handleCloseSnackbar}
         severity={message.includes("Error") ? "error" : "success"}
         variant="filled"
         sx={{ width: '100%' }}
       >
         {message}
       </Alert>
     </Snackbar>
   </Container>
 );
};

export default AnnounceResults;