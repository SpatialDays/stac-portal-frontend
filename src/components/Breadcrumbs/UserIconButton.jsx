// React
import React, { useEffect, useState, useContext } from "react";

// Context
import { UserDataContext } from "App";

// @mui components
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Avatar } from "@mui/material";

// Styles
import "./style.scss";


// User icon with dropdown menu
export const IconButtonWithDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userPicture, setUserPicture] = useState('');
  const [userName, setUserName] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [userDetails] = useContext(UserDataContext);

  useEffect(() => {
    async function fetchData() {
      let userPicture = userDetails.picture;
      let userName = userDetails.user_claims.find(item => item.typ === 'name').val;
      setUserName(userName);
      setUserPicture(userPicture);
      }
  
      fetchData();
  });

  return (
    <div className="breadcrumbs__container">
      <IconButton
        className = "breadcrumbs-button"
        aria-controls="dropdown-menu"
        aria-haspopup="true"
      >
        <Avatar
          alt = {userName}
          src = {userPicture}
          className = "breadcrumbs-avatar"
          onClick={handleClick}
        />
      </IconButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => (window.location.href = "/my-details")}>My Details</MenuItem>
        <MenuItem onClick={() => (window.location.href = "/.auth/logout")}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};
