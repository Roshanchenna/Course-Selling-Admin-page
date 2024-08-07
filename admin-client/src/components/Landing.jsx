import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ 
            height: '100vh',
            width: '100%',
            bgcolor: '#f0f4f8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <Container maxWidth="md" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Coursera Admin
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: '#34495e' }}>
                        Empower Your Educational Institution
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 6, color: '#7f8c8d', maxWidth: '600px', mx: 'auto' }}>
                        Streamline course management, and optimize your educational offerings with our advanced admin tools. Take control of your online learning platform today.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/signup")}
                            sx={{
                                bgcolor: '#1976d2',
                                '&:hover': { bgcolor: '#1565c0' },
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                            }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/signin")}
                            sx={{
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': {
                                    borderColor: '#1565c0',
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                },
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                            }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};