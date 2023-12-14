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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ButtonGroup from '@mui/material/ButtonGroup';
import { PatientNavBar } from './PatientNavBar.jsx';
import style from '../Styles/Notification.css';
import { DoctorNavBar } from './doctorNavBar.jsx';

const drawerWidth = 240;
const ITEM_HEIGHT = 48;


function createData(id, type, message, date, status, Category) {
    return { id, type, message, date, status, Category };
}

const options = [
    'Mark as read',
    'Mark as unread',
];

export default function ClippedDrawer() {

    const [tab, setTab] = React.useState('Inbox');
    const [notificationsCount, setNotificationsCount] = React.useState(0);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [inBoxrows, setInBoxRows] = React.useState([]);
    const [savedRows, setSavedRows] = React.useState([]);
    const [doneRows, setDoneRows] = React.useState([]);
    const [notifications, setNotifications] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [type, setType] = React.useState('');
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    async function handleClose(event) {
        setAnchorEl(null);
        if (event === 'Mark as read') {
            for (let i = 0; i < selectedRows.length; i++) {
                console.log(selectedRows[i]);
                await axios(`http://localhost:8000/notification/readnotification/${selectedRows[i]}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    }
                });
            }
        }
        else {
            for (let i = 0; i < selectedRows.length; i++) {
                await axios(`http://localhost:8000/notification/unReadnotification/${selectedRows[i]}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    }
                });
            }
        }
    };

    React.useEffect(() => {
        setList('Inbox');
        getNotifications();
    }, []);

    async function getNotifications() {
        const unReadNotifications = await axios('http://localhost:8000/notification/unReadNotifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });
        // console.log(unReadNotifications.data);
        setNotificationsCount(unReadNotifications.data.length);
        const getNotifications = await axios('http://localhost:8000/notification/notifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        setType(getNotifications.data.type)

        let saveTempRows = [];
        let doneTempRows = [];
        let tempRows = [];
        for (let i = 0; i < getNotifications.data.notifications.length; i++) {
            let dateString = getNotifications.data.notifications[i].timestamp.toString();
            let date = new Date(dateString);

            let options = { day: "numeric", month: "long" };
            let formattedDate = date.toLocaleDateString("en-US", options);

            // console.log(formattedDate); // Output: "13 December"
            if (getNotifications.data.notifications[i].Category === 'save')
                saveTempRows.push(createData(getNotifications.data.notifications[i]?._id,
                    getNotifications.data.notifications[i]?.type,
                    getNotifications.data.notifications[i].Message, formattedDate,
                    getNotifications.data.notifications[i]?.Status,
                    getNotifications.data.notifications[i]?.Category));
            else
                if (getNotifications.data.notifications[i].Category === 'done') {
                    console.log('done');
                    doneTempRows.push(createData(getNotifications.data.notifications[i]?._id,
                        getNotifications.data.notifications[i]?.type,
                        getNotifications.data.notifications[i].Message, formattedDate,
                        getNotifications.data.notifications[i]?.Status,
                        getNotifications.data.notifications[i]?.Category));
                }
                else
                    tempRows.push(createData(getNotifications.data.notifications[i]?._id,
                        getNotifications.data.notifications[i]?.type,
                        getNotifications.data.notifications[i].Message, formattedDate,
                        getNotifications.data.notifications[i]?.Status,
                        getNotifications.data.notifications[i]?.Category));
        }
        setNotifications(tempRows);
        setInBoxRows(tempRows);
        setSavedRows(saveTempRows);
        setDoneRows(doneTempRows);
        document.getElementById('all').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
    }

    const handleSelectAllClick = (event) => {
        // Your implementation
        if (tab == 'Inbox') {
            if (event.target.checked) {
                let temp = [];
                for (let i = 0; i < inBoxrows.length; i++) {
                    temp.push(inBoxrows[i].id);
                }
                setSelectedRows(temp);
            } else {
                setSelectedRows([]);
            }
        } else if (tab == 'Saved') {
            if (event.target.checked) {
                let temp = [];
                for (let i = 0; i < savedRows.length; i++) {
                    temp.push(savedRows[i].id);
                }
                setSelectedRows(temp);
            } else {
                setSelectedRows([]);
            }
        }
        else {
            if (event.target.checked) {
                let temp = [];
                for (let i = 0; i < doneRows.length; i++) {
                    temp.push(doneRows[i].id);
                }
                setSelectedRows(temp);
            } else {
                setSelectedRows([]);
            }
        }


    };

    const handleRowCheckboxClick = (event, rowId) => {
        // Your implementation
        console.log(rowId);
        if (selectedRows.includes(rowId)) {
            let temp = selectedRows.filter((item) => item !== rowId);
            setSelectedRows(temp);
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

    const showAll = () => {
        // make the id of All to be background color gray
        document.getElementById('all').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
        document.getElementById('unread').style.backgroundColor = 'white';
        if (tab == 'Inbox')
            setInBoxRows(notifications.filter((item) => item.Category !== 'done'));
        else if (tab == 'Saved')
            setSavedRows(notifications.filter((item) => item.Category !== 'done' || item.Category !== 'inbox'));
        else
            setDoneRows(notifications.filter((item) => item.Category !== 'save' || item.Category !== 'inbox'));
    }
    const showUnread = () => {
        // Your implementation
        document.getElementById('all').style.backgroundColor = 'white';
        document.getElementById('unread').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
        if (tab == 'Inbox')
            setInBoxRows(notifications.filter((item) => item.status === 'unread'));
        else if (tab == 'Saved')
            setSavedRows(notifications.filter((item) => item.status === 'unread'));
        else
            setDoneRows(notifications.filter((item) => item.status === 'unread'));
    }

    async function doneClick(id) {
        await axios(`http://localhost:8000/notification/donenotification/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        });
        setDoneRows(prevRows => {
            return prevRows.map(doneRows => {
                if (doneRows.id === id) {
                    return { ...doneRows, Category: 'done' };
                }
                return doneRows;
            });
        });
        setInBoxRows(inBoxrows.filter((item) => item.id !== id));



        setNotifications((prevNotifications) => {
            return prevNotifications.map((notification) => {
                if (notification.id === id) {
                    return { ...notification, Category: 'done' };
                }
                return notification;
            });
        });
    }

    async function saveClick(id) {
        await axios(`http://localhost:8000/notification/savenotification/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        });
        setSavedRows(prevRows => {
            return prevRows.map(savedRows => {
                if (savedRows.id === id) {
                    if (savedRows.Category === 'save')
                        return { ...savedRows, Category: 'inbox' };
                    else
                        return { ...savedRows, Category: 'save' };
                }
                return savedRows;
            });
        });

        setNotifications((prevNotifications) => {
            return prevNotifications.map((notification) => {
                if (notification.id === id) {
                    if (notification.Category === 'save')
                        return { ...notification, Category: 'inbox' };
                    else
                        return { ...notification, Category: 'save' };
                }
                return notification;
            });
        });
    }

    const setList = (list) => {
        // Your implementation
        setTab(list);
        if (list === 'Inbox') {
            setTab('Inbox');
            document.getElementById('active1').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
            document.getElementById('active2').style.backgroundColor = 'white';
            document.getElementById('active3').style.backgroundColor = 'white';
        }
        else if (list === 'Saved') {
            setTab('Saved');
            document.getElementById('active1').style.backgroundColor = 'white';
            document.getElementById('active2').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
            document.getElementById('active3').style.backgroundColor = 'white';
        }
        else {
            setTab('Done');
            document.getElementById('active1').style.backgroundColor = 'white';
            document.getElementById('active2').style.backgroundColor = 'white';
            document.getElementById('active3').style.backgroundColor = 'rgba(0, 0, 0, 0.183)';
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {type === 'patient' ? <PatientNavBar /> : <div />}
                    {type === 'Doctor' ? <DoctorNavBar /> : <div />}

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
                        <ListItem disablePadding id='active1'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inbox" onClick={() => { setList('Inbox') }} />
                                <ListItemText>{notificationsCount}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding id='active2'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BookmarkBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="Saved" onClick={() => { setList('Saved') }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding id='active3'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DoneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Done" onClick={() => { setList('Done') }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography paragraph>
                    <ButtonGroup variant="outlined" aria-label="outlined button group" className='mb-3'>
                        <Button id='all' onClick={showAll} className='buttonGroup'>All</Button>
                        <Button id='unread' onClick={showUnread} className='buttonGroup'>Unread</Button>
                    </ButtonGroup>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            indeterminate={tab == 'Inbox' ? selectedRows.length > 0
                                                && selectedRows.length < inBoxrows.length
                                                : tab == 'Saved' ? selectedRows.length > 0
                                                    && selectedRows.length < savedRows.length
                                                    : selectedRows.length > 0 && selectedRows.length < doneRows.length}
                                            checked={tab == 'Inbox' ? selectedRows.length === inBoxrows.length :
                                                tab == 'Saved' ? selectedRows.length === savedRows.length :
                                                    selectedRows.length === doneRows.length}
                                            onChange={handleSelectAllClick}
                                        />
                                        {selectedRows.length > 0 ? `(${selectedRows.length} selected)` : 'Select all'}
                                        {selectedRows.length > 0 ? <Button>Done</Button> : ''}
                                        {selectedRows.length > 0 ? <Button>Save</Button> : ''}
                                        {selectedRows.length > 0 ?
                                            <>
                                                <IconButton
                                                    aria-label="more"
                                                    id="long-button"
                                                    aria-controls={open ? 'long-menu' : undefined}
                                                    aria-expanded={open ? 'true' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id="long-menu"
                                                    MenuListProps={{
                                                        'aria-labelledby': 'long-button',
                                                    }}
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    PaperProps={{
                                                        style: {
                                                            maxHeight: ITEM_HEIGHT * 4.5,
                                                            width: '20ch',
                                                        },
                                                    }}
                                                >
                                                    {options.map((option) => (
                                                        <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => handleClose(option)}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            </>
                                            : ''}

                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tab == 'Inbox' ?
                                    inBoxrows.map((row) => (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox
                                                        checked={selectedRows.includes(row.id)}
                                                        onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                        defaultChecked
                                                    />
                                                    <div className='flex flex-column'>
                                                        <span>{row.type}</span>
                                                        <span>{row.message}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">
                                                <div className="iconsHover">
                                                    <span onClick={() => doneClick(row.id)}>
                                                        <DoneIcon />
                                                    </span>
                                                    <span onClick={() => saveClick(row.id)}>
                                                        {row.Category == 'save' ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                            </svg>
                                                            : <BookmarkBorderIcon />}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : tab == 'Saved' ?
                                        savedRows.map((row) => (
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox
                                                            checked={selectedRows.includes(row.id)}
                                                            onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                            defaultChecked
                                                        />
                                                        <div className='flex flex-column'>
                                                            <span>{row.type}</span>
                                                            <span>{row.message}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">{row.date}</TableCell>
                                                <TableCell align="right">
                                                    <div className="iconsHover">
                                                        <span onClick={() => doneClick(row.id)}>
                                                            <DoneIcon />
                                                        </span>
                                                        <span onClick={() => saveClick(row.id)}>
                                                            {row.Category == 'save' ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                                </svg>
                                                                : <BookmarkBorderIcon />}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : doneRows.map((row) => (
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox
                                                            checked={selectedRows.includes(row.id)}
                                                            onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                            defaultChecked
                                                        />
                                                        <div className='flex flex-column'>
                                                            <span>{row.type}</span>
                                                            <span>{row.message}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">{row.date}</TableCell>
                                                <TableCell align="right">
                                                    <div className="iconsHover">
                                                        <span onClick={() => doneClick(row.id)}>
                                                            <DoneIcon />
                                                        </span>
                                                        <span onClick={() => saveClick(row.id)}>
                                                            {row.Category == 'save' ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                                </svg>
                                                                : <BookmarkBorderIcon />}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                }
                                {/* {rows.map((row) => (
                                    row.Category == 'done' && tab == 'Done' ?
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox
                                                        checked={selectedRows.includes(row.id)}
                                                        onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                        defaultChecked
                                                    />
                                                    <div className='flex flex-column'>
                                                        <span>{row.type}</span>
                                                        <span>{row.message}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">
                                                <div className="iconsHover">
                                                    <span onClick={() => doneClick(row.id)}>
                                                        <DoneIcon />
                                                    </span>
                                                    <span onClick={() => saveClick(row.id)}>
                                                        {row.Category == 'save' ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                            </svg>
                                                            : <BookmarkBorderIcon />}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        row.Category == 'save' && tab == 'Saved' ?
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox
                                                            checked={selectedRows.includes(row.id)}
                                                            onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                            defaultChecked
                                                        />
                                                        <div className='flex flex-column'>
                                                            <span>{row.type}</span>
                                                            <span>{row.message}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">{row.date}</TableCell>
                                                <TableCell align="right">
                                                    <div className="iconsHover">
                                                        <span onClick={() => doneClick(row.id)}>
                                                            <DoneIcon />
                                                        </span>
                                                        <span onClick={() => saveClick(row.id)}>
                                                            {row.Category == 'save' ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                                </svg>
                                                                : <BookmarkBorderIcon />}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow> :
                                            tab == 'Inbox' ?
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Checkbox
                                                                checked={selectedRows.includes(row.id)}
                                                                onChange={(event) => handleRowCheckboxClick(event, row.id)}
                                                                defaultChecked
                                                            />
                                                            <div className='flex flex-column'>
                                                                <span>{row.type}</span>
                                                                <span>{row.message}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right">{row.date}</TableCell>
                                                    <TableCell align="right">
                                                        <div className="iconsHover">
                                                            <span onClick={() => doneClick(row.id)}>
                                                                <DoneIcon />
                                                            </span>
                                                            <span onClick={() => saveClick(row.id)}>
                                                                {row.Category == 'save' ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                                                    </svg>
                                                                    : <BookmarkBorderIcon />}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                : ''
                                ))} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Typography>
            </Box>
        </Box>
    );
}
