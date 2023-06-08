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

    window.location.href = `.auth/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.REACT_APP_LOGOUT_REDIRECT_URL)}`

    // console.log('the env var', process.env.REACT_APP_LOGOUT_REDIRECT_URL)
    // console.log('the encoded env var', encodeURIComponent(process.env.REACT_APP_LOGOUT_REDIRECT_URL))

    // try {
    //   // `.auth/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.REACT_APP_LOGOUT_REDIRECT_URL)}`
    //   const response = await fetch('/.auth/logout', {
    //     method: 'GET'
    //   });
    //   console.log(response)

    //   await new Promise(resolve => setTimeout(resolve, 20000));

    //   if (response.status === 200) {
    //     console.log('Successful redirect')
    //     console.log('process.env.REACT_APP_LOGOUT_REDIRECT_URL', process.env.REACT_APP_LOGOUT_REDIRECT_URL)
    //     window.location.href = `${process.env.REACT_APP_LOGOUT_REDIRECT_URL}`;

    //   } else {
    //     console.log('redirect Failed')
    //   }
  
    // } catch (error) {
    //   // Handle any errors during the request
    //   console.log('signout redirect failed')
    //   console.error(error);
    // }
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
