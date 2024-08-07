import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography, Box, Container} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import { BASE_URL } from "../config.js";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../store/atoms/user.js";

function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const setUser = useSetRecoilState(userState);

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f0f4f8',
        }}>
            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: '#1976d2' }}>
                    Welcome to Coursera
                </Typography>
                <Card variant="outlined" sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom align="center">
                        Sign up below
                    </Typography>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={async () => {
                            try {
                                const response = await axios.post(`${BASE_URL}/admin/signup`, {
                                    username: email,
                                    password: password
                                });
                                const data = response.data;
                                localStorage.setItem("token", data.token);
                                setUser({userEmail: email, isLoading: false});
                                navigate("/courses");
                            } catch (error) {
                                console.error("Signup failed:", error);
                                // Handle signup error (e.g., show an error message)
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </Card>
            </Container>
        </Box>
    );
}

export default Signup;