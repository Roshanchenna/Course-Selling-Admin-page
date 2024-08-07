import { Button, Card, Typography, Box, Container, Grid, CardContent, CardMedia, AppBar, Toolbar, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user.js";

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

    const handleDeleteCourse = async (courseId) => {
        try {
            await axios.delete(`${BASE_URL}/admin/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Remove the deleted course from the state
            setCourses(courses.filter(course => course._id !== courseId));
        } catch (error) {
            console.error("Failed to delete course:", error);
            // Optionally, show an error message to the user
        }
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
                    <Button 
                        color="inherit" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/addCourse')}
                        sx={{ mr: 2 }}
                    >
                        Add Course
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
                {courses.length > 0 ? (
                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                        <Grid container spacing={3}>
                            {courses.map(course => (
                                <Grid item xs={12} sm={6} md={4} key={course._id}>
                                    <CourseCard 
                                        course={course} 
                                        navigate={navigate} 
                                        onDelete={handleDeleteCourse}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Welcome to Your Course Dashboard!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            You haven't created any courses yet. Start sharing your knowledge with the world!
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/addCourse')}
                            size="large"
                        >
                            Create Your First Course
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

function CourseCard({ course, navigate, onDelete }) {
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                <Button 
                    size="small" 
                    onClick={() => navigate(`/course/${course._id}`)}
                    sx={{ 
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                    }}
                >
                    Edit
                </Button>
                <IconButton 
                    aria-label="delete" 
                    onClick={() => onDelete(course._id)}
                    sx={{
                        color: 'error.main',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Card>
    );
}

export default Courses;