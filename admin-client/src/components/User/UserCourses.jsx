import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config.js';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const UserCourses = () => {
  const [adminCourses, setAdminCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminCourses();
    fetchPurchasedCourses();
  }, []);

  const fetchAdminCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      setAdminCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin courses:', error);
      setError('Failed to fetch available courses');
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
      fetchAdminCourses();
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
        User Courses
      </Typography>

      <Typography variant="h5" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {adminCourses.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No available courses</Typography>
          </Grid>
        ) : (
          adminCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handlePurchase(course._id)}>Purchase</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
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