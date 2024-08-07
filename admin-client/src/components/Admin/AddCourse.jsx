import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Card, Typography, Box, Container, Grid} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import { BASE_URL } from "../../config.js"

function AddCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState(0)

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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Image link"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={async () => {
                                    try {
                                        await axios.post(`${BASE_URL}/admin/courses`, {
                                            title: title,
                                            description: description,
                                            imageLink: image,
                                            published: true,
                                            price
                                        }, {
                                            headers: {
                                                "Authorization": "Bearer " + localStorage.getItem("token")
                                            }
                                        });
                                        alert("Course added successfully!");
                                        window.location.href = "/courses";
                                    } catch (error) {
                                        console.error("Failed to add course:", error);
                                        alert("Failed to add course. Please try again.");
                                    }
                                }}
                            >
                                Add Course
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}

export default AddCourse;