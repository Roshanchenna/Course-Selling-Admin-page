import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ 
            height: '100vh',
            width: '100%',
            backgroundColor: '#f0f8ff', // Light blue background
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden', // Prevent scrolling
        }}>
            <Container maxWidth="lg">
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                    fontWeight: 700, 
                    color: '#1976d2', // Dark blue color
                    textAlign: 'center', 
                    mb: 4,
                }}>
                    Welcome to Coursera
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {['Admin', 'User'].map((userType) => (
                        <Grid item xs={12} md={6} key={userType}>
                            <Paper elevation={2} sx={{ 
                                p: 3, 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                            }}>
                                <Box>
                                    <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                        {userType}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
                                        {userType === 'Admin' ? 
                                            'Create and manage courses, oversee user enrollments, and optimize your educational offerings.'
                                            : 'Explore and purchase a wide range of courses. Enhance your skills and knowledge today.'
                                        }
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/${userType.toLowerCase()}/signup`)}
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#1565c0' },
                                            flex: 1,
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/${userType.toLowerCase()}/signin`)}
                                        sx={{
                                            borderColor: '#1976d2',
                                            color: '#1976d2',
                                            '&:hover': {
                                                borderColor: '#1565c0',
                                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                            },
                                            flex: 1,
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};