import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DoneIcon from '@mui/icons-material/Done';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import style from '../Styles/Notification.css';

const drawerWidth = 240;


function createData(id, type, message, date) {
    return { id, type, message, date };
}

const rows = [
    createData(1, 'Chat', 159, 6.0),
    createData(2, 'Chat', 237, 9.0),
    createData(3, 'Chat', 262, 16.0),
    createData(4, 'Chat', 305, 3.7),
    createData(5, 'Chat', 356, 16.0),
];

export default function ClippedDrawer() {

    const [tab, setTab] = React.useState('Inbox');
    const [notificationsCount, setNotificationsCount] = React.useState(0);

    React.useEffect(() => {
        getNotifications();
    }, []);

    async function getNotifications() {
        const response = await axios('http://localhost:8000/patient/unReadNotifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });
        console.log(response.data);
        setNotificationsCount(response.data.length);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Clipped drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inbox" onClick={() => setTab('Inbox')} />
                                <ListItemText>{notificationsCount}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BookmarkBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="Saved" onClick={() => setTab('Saved')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DoneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Done" onClick={() => setTab('Done')} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography paragraph>
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Checkbox
                                indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                checked={selectedRows.length === rows.length}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        {/* Other table header cells */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <div className='flex flex-column'>
                                    <Checkbox
                                        checked={selectedRows.includes(row.id)}
                                        onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                    />
                                    <span>{row.type}</span>
                                    <span>{row.message}</span>
                                </div>
                            </TableCell>
                            <TableCell align="right">{row.data}</TableCell>
                            {/* Other table cells */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
                </Typography>
            </Box>
        </Box>
    );
}
