// Modules
import axios from "axios";

// Url paths
import { backendUrl } from '../utils/paths.jsx'

// FOR TESTING
import { useState } from "react";


// adds user's profile picture to their data object
const addProfilePicture = async (userData) => {

  const accessToken = userData.access_token;

  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      userData.picture = 'no-picture.jpg';
      return userData;
    }

    const blob = await response.blob();
    const picture = URL.createObjectURL(blob);

    userData.picture = picture;
    return userData;

  } catch (error) {
    console.error(error);
    return userData;
  }
};

// returns the dev data object when in development
const getDevData = async () => {
  // paste in your own user data to test or use the dev default
  let data = [{"access_token":"000","id_token": "dev_mode", "user_claims":[{"typ":"name","val":"Dev User"},{"typ":"roles","val":".Developer"}],"user_id":"Dev User"}];
  // adds profile picture if one is set for dev user
  data = await addProfilePicture(data[0]);
  // add the user's API key to their object
  // data = await addAPIKey(data);
  return data;
};

// returns the user data object when in production (called in app.js)
const getAADData = async () => {

  try {
    const instance = axios.create();

    // Get the Azure AD data from /.auth/me but dont crash if 404
    const response = await instance.get("/.auth/me", {
      validateStatus: (status) => status === 200 || status === 404,
    });

    // Check if the response is valid
    if (response.status === 200) {
      const { expires_on } = response.data[0];
      const tokenExpiryTimestampUnix = new Date(expires_on).getTime();
      const nowUnix = new Date().getTime();
      const timeToExpiry = tokenExpiryTimestampUnix - nowUnix;
      if (timeToExpiry < 300000) {
        await instance.get("/.auth/refresh");
      }

      const newTokenResponse = await instance.get("/.auth/me");
      // adds the profile picture to the user data object
      let data = await addProfilePicture(newTokenResponse.data[0]);
      // add the user's API key to their object
      // data = await addAPIKey(data);
      // returns the whole user data object
      return data;  
    }

    // Implies we are localhost
    if (response.status === 404) {
      return null;
    }
  } catch (e) {
    console.log("Error fetching AAD token:", e);
  }

  window.location.href = "/.auth/login/aad";

  return null;
};

// returns the users id token in production 
const getAADToken = async () => {

  try {
    const instance = axios.create();

    // Get the Azure AD data from /.auth/me but dont crash if 404
    const response = await instance.get("/.auth/me", {
      validateStatus: (status) => status === 200 || status === 404,
    });

    // Check if the response is valid
    if (response.status === 200) {
      const { expires_on } = response.data[0];
      const tokenExpiryTimestampUnix = new Date(expires_on).getTime();
      const nowUnix = new Date().getTime();
      const timeToExpiry = tokenExpiryTimestampUnix - nowUnix;
      if (timeToExpiry < 300000) {
        await instance.get("/.auth/refresh");
      }

      const newTokenResponse = await instance.get("/.auth/me");
      const { id_token } = newTokenResponse.data[0];
      return id_token;
    }

    // Implies we are localhost
    if (response.status === 404) {
      return null;
    }
  } catch (e) {
    console.log("Error fetching AAD token:", e);
  }

  window.location.href = "/.auth/login/aad";
  return null;
};

// returns the user data object with the profile picture included
const auth = async () => {

  // if in production, set axois headers
  axios.interceptors.request.use(async (config) => {

    const token = await getAADToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export { getDevData, getAADData, auth };
