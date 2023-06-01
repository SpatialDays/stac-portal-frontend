// React
import React, { useEffect, useState, useContext } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { ContentCopy } from "@mui/icons-material";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// STAC Portal components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Interface
import { Avatar } from "@mui/material";

// Context
import { UserDataContext } from "App";

// Styles
import "./style.scss";

// set up the display of the user's details
const DisplayMyDetails = () => {

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPicture, setUserPicture] = useState('');
  const userDetails = useContext(UserDataContext);
  
  useEffect(() => {
    // getting the user's name and role from the user_claims array
    function getValueByType(list, valueType) {
      if (list && list.length > 0){
        const value = list.find(item => item.typ === valueType);
        return value ? value.val : '';
      }  
    }
  
    async function fetchData() {
      // getting the user's name, role and picture from the userDetails object
      const userDetailsList = userDetails.user_claims;
      const userName = getValueByType(userDetailsList, 'name');
      let userRole = getValueByType(userDetailsList, 'roles');
      const userPicture = userDetails.picture ? userDetails.picture : null;
      userRole = userRole ? userRole.split('.')[1]: userRole;

      setUserName(userName);
      setUserRole(userRole);
      setUserPicture(userPicture);
    }
    
    fetchData();
  }, [userDetails]);
  console.log(userDetails);

  // placeholder until functionality for providing API keys is ready
  let apiKey = '00000000000000000000000000000000';  

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={0.5}>
          <Grid item xs={12}>
            <Card className="card-title">
              <MDBox>
                <MDTypography variant="h4">My Details</MDTypography>
              </MDBox>
            </Card>
            <Grid item xs={12} className="my-details-container">
              <Card
                className="my-details-card"
              >
                <Grid
                className="my-details-grid"
                >
                  <Avatar
                    alt = {userName}
                    src= {userPicture}
                    className="avatar"
                  />
                </Grid>
                <Grid
                  className="my-details-grid"
                >
                  <List
                    className="my-details-list"
                  >
                    <ListItem>
                      <MDTypography variant="h4">Name:</MDTypography>
                      <span class="my-details-item">{userName}</span>
                    </ListItem>
                    <ListItem>
                      <MDTypography variant="h4">Role:</MDTypography>
                      <span class="my-details-item">{userRole}</span>
                    </ListItem>
                    <ListItem>
                      <MDTypography variant="h4">API Key:</MDTypography>
                      <span id="api-key" class="my-details-item">{apiKey.slice(0, 7)}...</span>
                      <IconButton
                        className='copy-api-key-button'
                        title="Copy API Key to clipboard"
                      >
                        <ContentCopy
                          className='copy-api-key-icon' 
                          onClick={() =>  navigator.clipboard.writeText(apiKey)}
                        />
                      </IconButton>
                    </ListItem>
                    <ListItem>
                      <MDButton
                        buttonType="refresh"
                        className="btn-full-width"
                        // onClick={handleRefreshAPIKey}  // functionality to be added
                      >
                        Refresh API Key
                      </MDButton>
                    </ListItem>                  
                  </List>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export { DisplayMyDetails };
