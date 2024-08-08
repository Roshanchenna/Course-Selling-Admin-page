import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';

const UserCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCourses();
    fetchPurchasedCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
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
      const response = await axios.get(`${BASE_URL}/users/purchasedCourses`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      setPurchasedCourses(response.data.purchasedCourses);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      setError('Failed to fetch purchased courses');
    }
  };

  const handlePurchase = async (courseId) => {
    try {
      await axios.post(`${BASE_URL}/users/courses/${courseId}`, {}, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      // Refresh the lists after purchase
      fetchAllCourses();
      fetchPurchasedCourses();
    } catch (error) {
      console.error('Error purchasing course:', error);
      setError('Failed to purchase course');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Courses
      </Typography>

      <Grid container spacing={3}>
        {allCourses.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No courses available</Typography>
          </Grid>
        ) : (
          allCourses.map(course => (
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
                  {purchasedCourses.some(pc => pc._id === course._id) ? (
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

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Purchased Courses
      </Typography>
      <Grid container spacing={3}>
        {purchasedCourses.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No purchased courses</Typography>
          </Grid>
        ) : (
          purchasedCourses.map(course => (
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
                </CardContent>
                <CardActions>
                  <Button size="small" href={`/course/${course._id}`}>Go to Course</Button>
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
    </Box>
  );
};

export default UserCourses;