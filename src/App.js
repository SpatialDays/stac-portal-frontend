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
import { auth } from "auth/auth";

export const UserDataContext = createContext();

export default function App() {

  const [userData, setUserData] = useState(null);

  // getting the user data and setting it to the state
  useEffect(() => {
    async function getUserData() {
      let userData = await auth();
      console.log(userData);
      setUserData(userData);
      }
  
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
    // passing the userData in the context
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
