import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../store/atoms/user.js';

function UserSidebar() {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser({userEmail: null, isLoading: false});
        navigate('/');
    };

    return (
        <Box
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                },
                height: '100vh',
                bgcolor: 'background.paper',
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap component="div">
                    User Dashboard
                </Typography>
            </Box>
            <List>
                <ListItem button onClick={() => navigate('/user/dashboard')}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => navigate('/user/courses')}>
                    <ListItemIcon>
                        <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Courses" />
                </ListItem>
            </List>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ExitToAppIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}

export default UserSidebar;