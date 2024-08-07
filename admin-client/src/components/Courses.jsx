import { Button, Card, Typography, Box, Container, Grid, CardContent, CardMedia, AppBar, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user.js";

function Courses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    const init = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/courses/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCourses(response.data.courses);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser({userEmail: null, isLoading: false});
        navigate('/');
    };

    return (
        <Box sx={{ 
            bgcolor: '#f5f5f5', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Courses
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Grid container spacing={3}>
                        {courses.map(course => (
                            <Grid item xs={12} sm={6} md={4} key={course._id}>
                                <CourseCard course={course} navigate={navigate} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}

function CourseCard({ course, navigate }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="div"
                sx={{
                    height: 0,
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    bgcolor: '#e0e0e0', // Light grey background for the image area
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${!imageError ? course.imageLink : 'https://via.placeholder.com/300x169.png?text=No+Image'})`,
                }}
            >
                {!imageError && (
                    <img
                        src={course.imageLink}
                        alt={course.title}
                        style={{ display: 'none' }}
                        onError={handleImageError}
                    />
                )}
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price: ${course.price}
                </Typography>
            </CardContent>
            <Button 
                size="small" 
                onClick={() => navigate(`/course/${course._id}`)}
                sx={{ 
                    alignSelf: 'flex-start', 
                    ml: 2, 
                    mb: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                }}
            >
                Edit
            </Button>
        </Card>
    );
}

export default Courses;