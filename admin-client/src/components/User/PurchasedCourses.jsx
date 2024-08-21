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

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`${BASE_URL}/user/purchasedCourses`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      setPurchasedCourses(response.data.purchasedCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchased courses:', error.response ? error.response.data : error.message);
      setError(error.message || 'Failed to fetch purchased courses');
      setLoading(false);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Purchased Courses
          </Typography>
          <Grid container spacing={3}>
            {purchasedCourses.length === 0 ? (
              <Grid item xs={12}>
                <Typography>You haven't purchased any courses yet.</Typography>
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
                      <Typography variant="body2" color="text.secondary">
                        Instructor: {course.creator ? course.creator.username : 'Unknown'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" href={`/course/${course._id}`}>
                        Go to Course
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
{/* 
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            {/* <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert> */}
          {/* </Snackbar> */}
        </Box>
      </Box>
    </Box>
  );
};

export default PurchasedCourses;