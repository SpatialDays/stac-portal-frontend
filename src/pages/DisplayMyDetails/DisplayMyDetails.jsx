// React
import React, { useEffect, useState, useContext } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import { CommentsDisabledOutlined, ContentCopy } from "@mui/icons-material";

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
import { set } from "date-fns";


// set up the display of the user's details
const DisplayMyDetails = () => {

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPicture, setUserPicture] = useState('');
  const [userAPIKey, setUserAPIKey] = useState('');
  const [userDetails, setUserDetails] = useContext(UserDataContext);

  const handleRefreshAPIKey = async (userDetails) => {
    console.log('API KEY REFRESH')

    let newAPIKey = '00000000000000000000000000000000';  // default in case of error

    if (userDetails.id_token === 'dev_mode') {
      // default API key placeholder for dev mode
      console.log('dev mode default apik being set:', newAPIKey);
      return newAPIKey;
    }

    try {
      const url = new URL('apim/refresh/', backendUrl).toString();
      const response = await axios({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': `Bearer ${userDetails.id_token}`
        }
      });

      console.log('refresh response: ', response);
  
      newAPIKey = response.data.secrets.primaryKey;
  
      console.log(userDetails)
      console.log('new key:', newAPIKey)
  
      setUserAPIKey(newAPIKey);

    } catch (error) {
      console.log('response not ok');
      console.error(error);
      return newAPIKey;
    }

  };
  
  useEffect(() => {
    console.log('RUNNING USE EFFECT')

    // getting the user's name and role from the user_claims array
    function getValueByType(list, valueType) {
      if (list && list.length > 0){
        const value = list.find(item => item.typ === valueType);
        return value ? value.val : '';
      }  
    };

    //  function to get the user's APIKey using their id_token
    const getUserAPIKey = async (userDetails) => {
      console.log('API KEY GET')
      let userAPIKey = '00000000000000000000000000000000';
    
      if (userDetails.id_token === 'dev_mode') {
        // default API key placeholder for dev mode
        console.log('dev mode default apik being set:', userAPIKey);
        return userAPIKey;
      }

      try {

        const url = new URL('apim/', backendUrl).toString();
        const response = await axios({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': `Bearer ${userDetails.id_token}`
          }
        });

        console.log('get response: ', response)

        console.log(response);
        console.log(response.data);
        
        userAPIKey = response.data.secrets.primaryKey;
        console.log(userAPIKey);

        // userDetails.userAPIKey = userAPIKey;  // ADD it to the user data object?
        return userAPIKey;

      } catch (error) {
        console.log('response not ok');
        console.error(error);
        return userAPIKey;
      }
    
      // test version
      // try {

      //   const resp = api_json;  // to be replaced with using the user token_id to get the API key
      //   console.log(resp);
    
      //   const user_api_key = resp.secrets.primaryKey;
      //   return user_api_key;
  
      // } catch (error) {
      //   console.log('response not ok');
      //   console.error(error);
      //   return null  // userDetails;
      // }
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
                        <span id="api-key" class="my-details-item">{userAPIKey.slice(0, 7)}...</span>
                      <IconButton
                        className='inline-copy-api-key-button'
                        title="Copy API Key to clipboard"
                      >
                        <ContentCopy
                          className='copy-api-key-icon' 
                          onClick={() =>  navigator.clipboard.writeText(userAPIKey)}
                        />
                      </IconButton>
                    </ListItem>
                    <ListItem className="copy-button-list-item">
                      <MDButton
                        buttonType="copy"
                        className="btn-full-width copy-api-key-button"
                        onClick={() =>  navigator.clipboard.writeText(userAPIKey)}
                      >
                        Copy API Key
                      </MDButton>
                    </ListItem> 
                    <ListItem>
                      <MDButton
                        buttonType="refresh"
                        className="btn-full-width refresh-api-key-button"
                        // onClick={handleRefreshAPIKey}  // refreshAPIKey(userDetails);
                        onClick={() => {
                          handleRefreshAPIKey(userDetails)
                        }}
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
