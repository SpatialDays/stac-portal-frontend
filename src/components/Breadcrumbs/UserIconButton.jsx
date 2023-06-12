// React
import React, { useEffect, useState, useContext } from "react";

// Modules
import axios from "axios";

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

  const handleLogoutRedirect = async () => {

    try {
      console.log('logging out')
      window.location.href = 'https://os-eo-platform-rg-staging-stac-portal-frontend.azurewebsites.net/.auth/logout';
      console.log('logged out')

      console.log('redirecting to', process.env.REACT_APP_LOGOUT_REDIRECT_URL)
      window.location.href = encodeURIComponent(process.env.REACT_APP_LOGOUT_REDIRECT_URL);
      console.log('redirected')

    } catch (error) {
      // Handle any errors during the request
      console.log('Signout redirect failed')
      console.error(error);
    } finally {
      console.log('Successful signout redirect')
    }
  };

  const userDetails = useContext(UserDataContext)[0];

  useEffect(() => {
    if (userDetails && userDetails.picture) {
      const userPicture = userDetails.picture;
      const userName = userDetails.user_claims.find(item => item.typ === 'name').val;
      setUserName(userName);
      setUserPicture(userPicture);
    }
  }, [userDetails]);

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

        <MenuItem onClick={handleLogoutRedirect}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};
