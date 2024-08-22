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
  AppBar,
  Toolbar,
} from '@mui/material';

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${BASE_URL}/user/purchasedCourses`, {
        headers: {
          authorization: 'Bearer ' + token,
        },
      });
      const courseIds = response.data.purchasedCourses;
      console.log(response.data.purchasedCourses);

      const courseDetails = await Promise.all(
        courseIds.map(async (id) => {
          const courseResponse = await axios.get(`${BASE_URL}/user/courses/${id}`, {
            headers: {
              authorization: 'Bearer ' + token,
            },
          });
          return courseResponse.data;
        })
      );

      setPurchasedCourses(courseDetails);
      console.log(courseDetails);
      
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchased courses:', error.response ? error.response.data : error.message);
      setError(error.message || 'Failed to fetch purchased courses');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Courses
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {purchasedCourses.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                You haven't purchased any courses yet.
              </Typography>
            </Grid>
          ) : (
            purchasedCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.imageLink || 'https://via.placeholder.com/300x140?text=Course+Image'}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description: {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {course.price}$
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.creator ? course.creator.username.charAt(0).toUpperCase() + course.creator.username.slice(1) : 'Unknown'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Purchased Course
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default PurchasedCourses;
