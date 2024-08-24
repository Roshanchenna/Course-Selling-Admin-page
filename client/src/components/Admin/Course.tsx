import { Card, Grid, Typography, TextField, Button, Box, Container, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../constants/Loading.js";
import { BASE_URL } from "../../config.js";
import {useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "../../store/atoms/course.ts";
import { courseTitle, coursePrice, isCourseLoading, courseImage } from "../../store/selectors/course.ts";

interface Course {
    _id: string;
    title: string;
    description: string;
    imageLink: string;
    price: number;
}

interface CourseState{
    isLoading ?: boolean,
    course : Course | null
}

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
            console.log(e);
            
        });
    }, []);

    if (courseLoading) {
        return <Loading />;
    }

    return (
        <Box sx={{ 
            bgcolor: '#f5f5f5', 
            minHeight: '100vh', 
            py: 4
        }}>
            <Container maxWidth="lg">
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    Edit Course
                                </Typography>
                                <UpdateCard navigate={navigate} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CourseCard />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}

interface UpdateCardProps {
    navigate: ReturnType<typeof useNavigate>;
}

function UpdateCard({ navigate }: UpdateCardProps) {
    const courseDetails = useRecoilValue<CourseState>(courseState);
    const [title, setTitle] = useState(courseDetails?.course?.title || " ");
    const [description, setDescription] = useState(courseDetails?.course?.description);
    const [image, setImage] = useState(courseDetails?.course?.imageLink);
    const [price, setPrice] = useState(courseDetails?.course?.price);

    const handleUpdate = async () => {
        try {
            await axios.put(`${BASE_URL}/admin/courses/` + courseDetails?.course?._id, {
                title, description, imageLink: image, published: true, price
            }, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            navigate("/admin/courses");
        } catch (error) {
            console.error("Failed to update course:", error);
            alert("Failed to update course. Please try again.");
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField fullWidth label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Description" variant="outlined" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Image Link" variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Price" variant="outlined" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth sx={{ py: 1.5 }}>
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                image={imageLink}
                alt={title}
                sx={{ 
                    height: 300, 
                    objectFit: 'cover'
                }}
            />
            <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Price: ${price}
                </Typography>
                {/* <Typography variant="body1" color="text.secondary">
                    This is how your course will appear to users. The image, title, and price are displayed prominently to attract potential students.
                </Typography> */}
            </Box>
        </Box>
    );
}

export default Course;