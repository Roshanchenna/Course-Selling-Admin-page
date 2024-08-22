import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Card, Typography, Box, Container, Grid, Switch, FormControlLabel, Snackbar, Alert} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import { BASE_URL } from "../../config.js"
import { useNavigate } from 'react-router-dom';

function AddCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState(0);
    const [published, setPublished] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not authenticated. Please log in.");
                return;
            }

            const response = await axios.post(`${BASE_URL}/admin/courses`, {
                title,
                description,
                imageLink: image,
                published,
                price
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/courses');
            }, 1000);
        } catch (error) {
            console.error("Failed to add course:", error);
            if (error.response) {
                console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
                console.error("Error status:", error.response.status);
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            setError("Failed to add course. Please try again.");
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f0f4f8',
            overflow: 'hidden',
        }}>
            <Container maxWidth="md" sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 2,
            }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2, color: '#1976d2' }}>
                    Add New Course
                </Typography>
                <Card variant="outlined" sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    variant="outlined"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    variant="outlined"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={published}
                                            onChange={(e) => setPublished(e.target.checked)}
                                            name="published"
                                            color="primary"
                                        />
                                    }
                                    label="Publish course"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Add Course
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Container>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Course added successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AddCourse;