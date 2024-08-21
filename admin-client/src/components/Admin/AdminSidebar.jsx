import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const AdminSidebar = ({ adminName }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Courses', icon: <SchoolIcon />, path: '/admin/courses' },
    { text: 'Add Course', icon: <AddCircleOutlineIcon />, path: '/admin/addCourse' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          {adminName.toUpperCase() || 'Admin'}
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e0e0e0',
                '&:hover': {
                  backgroundColor: '#d5d5d5',
                },
              },
              '&:hover': {
                backgroundColor: '#eeeeee',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  color: location.pathname === item.path ? '#1976d2' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;