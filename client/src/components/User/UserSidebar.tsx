import { Box, List, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';

function UserSidebar({userName}: {userName : string | null}) {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                },
                height: '100',
                bgcolor: 'background.paper',
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap component="div">
                    {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'user' }
                </Typography>
            </Box>
            <List>
                <ListItem button onClick={() => navigate('/user/PurchasedCourses')}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Purchased" />
                </ListItem>
                <ListItem button onClick={() => navigate('/user/courses')}>
                    <ListItemIcon>
                        <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Courses" />
                </ListItem>
            </List>
        </Box>
    );
}

export default UserSidebar;