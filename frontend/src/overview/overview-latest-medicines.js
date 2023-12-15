import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const options = [
    'View',
    'Delete'
];

const ITEM_HEIGHT = 48;

export const OverviewLatestMedicines = (props) => {
    const { sx } = props;

    const [products, setProducts] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getProducts();
    }, []);


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (option) => {
        setAnchorEl(null);
        // if(option === 'Delete'){
        //     deleteProduct(products[0]._id);
        // }
        // else if(option === 'View'){
        //     viewProduct(products[0]._id);
        // }
    };

    const getProducts = async () => {
        const response = await axios.get(
            `http://localhost:8000/admin/getAllMedicine`,
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
            const product = response.data.Result.splice(0, 5);
            console.log(product);
            setProducts(product);
        }
    }

    const deleteProduct = async (id) => {
        const response = await axios.delete(
            `http://localhost:8000/admin/deleteMedicine/${id}`,
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
        );
        if (response.status === 200) {
            getProducts();
        }
    }

    const viewProduct = async (id) => {
        navigate('/viewMedicine', { state: { id: id } })
    }

    return (
        <Card sx={sx}>
            <CardHeader title="Latest Products" />
            <List>
                {products.map((product, index) => {
                    const hasDivider = index < products.length - 1;
                    const myDate = new Date(product.updatedAt);
                    const ago = myDate.getDate();

                    return (
                        <ListItem
                            divider={hasDivider}
                            key={product._id}
                        >
                            <ListItemAvatar>
                                {
                                    product.Picture
                                        ? (
                                            <Box
                                                component="img"
                                                src={`data:${product.Picture.contentType};base64,${arrayBufferToBase64(product.Picture.data.data)}`}
                                                alt={product.Name}
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                        : (
                                            <Box
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: 'neutral.200',
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                }
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.Name}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                secondary={`Updated ${ago} days ago`}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <IconButton
                                edge="end"
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
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                        </SvgIcon>
                    )}
                    size="small"
                    variant="text"
                >
                    View all
                </Button>
            </CardActions>
        </Card>
    );
};

OverviewLatestMedicines.propTypes = {
    sx: PropTypes.object
};

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}