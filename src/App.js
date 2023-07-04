// React
import { useEffect, useState, createContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Layout components
import Sidenav from "components/Sidenav";

// Routes
import routes from "routes";

// Images
import STAClogo from "assets/images/logo.png";

// Styles
import "./assets/styles/base.scss";
import { getDevData, getAADData } from "auth/auth";

export const UserDataContext = createContext();

export default function App() {

  const [userData, setUserData] = useState(null);

  // getting the user data and setting it to the state
  useEffect(() => {
    // returns the user data object with the profile picture included
    const getUserData = async () => {

      // if in development, return the dev data object
      if (process.env.NODE_ENV !== 'production'){
        const userData = await getDevData();
        setUserData(userData); 
      } else {
        // if in production, return the user data object (calls the getAADData function which sets the axois headers only for prod)
        let userData = await getAADData();

        setUserData(userData);
      }
    };
  
      getUserData();
  }, []);
  
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  return (
    // passing just the userData in the context
    <UserDataContext.Provider value={[userData, setUserData]}>
      <Sidenav brand={STAClogo} brandName="STAC Portal" routes={routes} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          id="content-display"
        >
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/local-searcher" />} />
          </Routes>
        </div>
      </div>
    </UserDataContext.Provider >
  );
}
