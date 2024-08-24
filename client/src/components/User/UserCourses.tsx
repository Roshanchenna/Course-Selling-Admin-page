import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config.js';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';

type CourseState = {
  _id: number,
  title: string,
  description: string,
  imageLink: string,
  creator: Creator,
  price: number
}
type Creator = {
  username: string
}

const UserCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCourses();
    fetchPurchasedCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/courses`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setAllCourses(response.data.courses);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const fetchPurchasedCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/purchasedCourses`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      setPurchasedCourses(response.data.purchasedCourses);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      setError('Failed to fetch purchased courses');
    }
  };

  const handlePurchase = async (courseId: number) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/courses/${courseId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess('Course purchased successfully!');
      fetchPurchasedCourses();
      console.log(response);
      
    } catch (error) {
      setError('Course is already purchased');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Courses
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ p: 3 }}>
        {allCourses.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No courses available</Typography>
          </Grid>
        ) : (
          allCourses.map((course: CourseState) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.imageLink || 'https://via.placeholder.com/300x140?text=Course+Image'}
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created by: {course.creator ? course.creator.username : 'Unknown'}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${course.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  {purchasedCourses.some((pc: CourseState) => pc._id === course._id) ? (
                    <Button size="small" disabled>Purchased</Button>
                  ) : (
                    <Button size="small" onClick={() => handlePurchase(course._id)}>Purchase</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserCourses;
