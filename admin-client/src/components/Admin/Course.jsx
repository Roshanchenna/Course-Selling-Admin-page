import { Card, Grid, Typography, TextField, Button, Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../constants/Loading.jsx";
import { BASE_URL } from "../../config.js";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "../../store/atoms/course.js";
import { courseTitle, coursePrice, isCourseLoading, courseImage } from "../../store/selectors/course.js";

function Course() {
    let { courseId } = useParams();
    const navigate = useNavigate();
    const setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/course/${courseId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({isLoading: false, course: res.data.course});
        })
        .catch(e => {
            setCourse({isLoading: false, course: null});
        });
    }, []);

    if (courseLoading) {
        return <Loading />;
    }

    return (
        <Box sx={{ 
            bgcolor: '#f5f5f5', 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container maxWidth="md">
                <Card elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
                        Edit Course
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <UpdateCard navigate={navigate} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CourseCard />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}

function UpdateCard({ navigate }) {
    const [courseDetails, setCourse] = useRecoilState(courseState);
    const [title, setTitle] = useState(courseDetails.course.title);
    const [description, setDescription] = useState(courseDetails.course.description);
    const [image, setImage] = useState(courseDetails.course.imageLink);
    const [price, setPrice] = useState(courseDetails.course.price);

    const handleUpdate = async () => {
        try {
            await axios.put(`${BASE_URL}/admin/courses/` + courseDetails.course._id, {
                title, description, imageLink: image, published: true, price
            }, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            navigate("/courses");
        } catch (error) {
            console.error("Failed to update course:", error);
            alert("Failed to update course. Please try again.");
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField fullWidth label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Description" variant="outlined" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Image Link" variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Price" variant="outlined" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>
                    Update Course
                </Button>
            </Grid>
        </Grid>
    );
}

function CourseCard() {
    const title = useRecoilValue(courseTitle);
    const imageLink = useRecoilValue(courseImage);
    const price = useRecoilValue(coursePrice);

    return (
        <Box>
            <Box sx={{ 
                height: 150, 
                backgroundImage: `url(${imageLink})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mb: 2,
                borderRadius: 1
            }} />
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
                Price: ${price}
            </Typography>
        </Box>
    );
}

export default Course;