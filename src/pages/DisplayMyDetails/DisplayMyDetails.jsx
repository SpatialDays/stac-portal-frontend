// React
import React, { useEffect, useState, useContext } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { ContentCopy, Visibility, VisibilityOff } from "@mui/icons-material";

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

// API Key refreshing
import axios from "axios";

// Url paths
import { backendUrl } from '../../utils/paths.jsx'

// Styles
import "./style.scss";


// set up the display of the user's details
const DisplayMyDetails = () => {

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPicture, setUserPicture] = useState('');
  const [userAPIKey, setUserAPIKey] = useState('');
  const [refreshAPIKeyButtonText, setRefreshAPIKeyButtonText] = useState('Refresh API Key');
  const [isRefreshingAPIKey, setIsRefreshingAPIKey] = useState(false);  // to disable the refresh API Key button while it's refreshing
  const [showFullAPIKey, setShowFullAPIKey] = useState(false);
  const [userDetails, setUserDetails] = useContext(UserDataContext);

  const handleRefreshAPIKey = async (userDetails) => {

    // disabling the refresh api key button until the refresh is complete
    setIsRefreshingAPIKey(true);
    setRefreshAPIKeyButtonText('Refreshing...');

    // default in case of error or for dev mode
    let newAPIKey = '00000000000000000000000000000000';  

    if (userDetails.id_token === 'dev_mode') {
      // resetting the refresh api key button in dev mode
      setIsRefreshingAPIKey(false);
      setRefreshAPIKeyButtonText('Refresh API Key');
      return newAPIKey;
    }

    try {
      // creating url and fetching the refreshed api key
      const url = new URL('apim/refresh/', backendUrl).toString();
      const response = await axios({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': `Bearer ${userDetails.id_token}`
        }
      });
  
      newAPIKey = response.data.secrets.primaryKey;
      setUserAPIKey(newAPIKey);

    } catch (error) {
      console.log('response not ok');
      console.error(error);
      return newAPIKey;

    } finally {
      // resetting the refresh api key button
      setIsRefreshingAPIKey(false);
      setRefreshAPIKeyButtonText('Refresh API Key');
    }

  };
  
  useEffect(() => {

    // getting the user's name and role from the user_claims array
    function getValueByType(list, valueType) {
      if (list && list.length > 0){
        const value = list.find(item => item.typ === valueType);
        return value ? value.val : '';
      }  
    };

    //  function to get the user's APIKey using their id_token
    const getUserAPIKey = async (userDetails) => {

      // default in case of error or for dev mode
      let userAPIKey = '00000000000000000000000000000000';
    
      if (userDetails.id_token === 'dev_mode') {
        return userAPIKey;
      }

      try {
        // creating url and fetching the user's api key
        const url = new URL('apim/', backendUrl).toString();
        const response = await axios({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': `Bearer ${userDetails.id_token}`
          }
        });
        
        userAPIKey = response.data.secrets.primaryKey;
        return userAPIKey;

      } catch (error) {
        console.log('response not ok');
        console.error(error);
        return userAPIKey;
      }
    };
  
    async function fetchData() {
      // getting the user's name, role and picture from the userDetails object
      const userDetailsList = userDetails.user_claims;
      const userName = getValueByType(userDetailsList, 'name');
      let userRole = getValueByType(userDetailsList, 'roles');
      userRole = userRole ? userRole.split('.')[1]: userRole;
      const userPicture = userDetails.picture ? userDetails.picture : null;
      const userAPIKey = await getUserAPIKey(userDetails);  // userDetails.user_api_key;
      
      setUserName(userName);
      setUserRole(userRole);
      setUserPicture(userPicture);
      setUserAPIKey(userAPIKey);
    }
    
    if (userDetails){
      fetchData();
    };
    
  }, [userDetails]);

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
                        <span
                          className={`my-details-item ${showFullAPIKey ? 'hide-api-key' : ''}`}
                        >
                          {userAPIKey.slice(0, 7)}...
                        </span>
                      <IconButton
                        className='inline-api-key-button'
                        title="Copy API Key to clipboard"
                      >
                        <ContentCopy
                          className='api-key-icon' 
                          onClick={() =>  navigator.clipboard.writeText(userAPIKey)}
                        />
                      </IconButton>
                      <IconButton
                        className={`inline-api-key-button ${showFullAPIKey ? 'hide-inline-button' : ''}`}
                        title="Show full API Key"
                      >
                        <Visibility
                          className='api-key-icon' 
                          onClick={() =>  setShowFullAPIKey(true)}
                        />
                      </IconButton>
                      <IconButton
                        className={`inline-api-key-button ${!showFullAPIKey ? 'hide-inline-button' : ''}`}
                        title="Hide full API Key"
                      >
                        <VisibilityOff
                          className='api-key-icon' 
                          onClick={() =>  setShowFullAPIKey(false)}
                        />
                      </IconButton>
                    </ListItem>
                    <ListItem
                      className={`full-api-key my-details-item ${!showFullAPIKey ? 'hide-api-key' : ''}`}
                    >
                      {userAPIKey}
                    </ListItem>
                    <ListItem className="api-key-function-buttons-list-item">
                      <MDButton
                        buttonType="copy"
                        className="btn-full-width api-key-function-buttons"
                        onClick={() =>  navigator.clipboard.writeText(userAPIKey)}
                      >
                        Copy API Key
                      </MDButton>
                    </ListItem>
                    <ListItem
                      className={`${showFullAPIKey ? 'hide-api-key-function-button' : 'api-key-function-buttons-list-item'}`}
                      >
                      <MDButton
                        buttonType="visibility"
                        className='btn-full-width api-key-function-buttons'
                        onClick={() =>  setShowFullAPIKey(true)}
                      >
                        Show full API Key
                      </MDButton>
                    </ListItem>
                    <ListItem
                      className={`${!showFullAPIKey ? 'hide-api-key-function-button' : 'api-key-function-buttons-list-item'}`}
                    >
                      <MDButton
                        buttonType="visibility-off"
                        className="btn-full-width api-key-function-buttons"
                        onClick={() =>  setShowFullAPIKey(false)}
                      >
                        Hide full API Key
                      </MDButton>
                    </ListItem>
                    <ListItem>
                      <MDButton
                        buttonType='refresh'
                        className={`btn-full-width refresh-api-key-button ${isRefreshingAPIKey ? 'disabled-refresh-button' : ''}`}
                        disabled= {isRefreshingAPIKey}
                        onClick={() => {
                          handleRefreshAPIKey(userDetails);
                        }}
                      >
                        {refreshAPIKeyButtonText}
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
