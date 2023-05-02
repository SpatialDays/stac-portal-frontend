// React
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Layout components
import Sidenav from "components/Sidenav";

// Routes
import routes from "routes";

// Images
import STAClogo from "assets/images/stac.png";

// Styles
import "./assets/styles/base.scss";

export default function App() {
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
    <>
      <Sidenav brand={STAClogo} brandName="STAC Portal" routes={routes} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* The sidenav takes 300px, so use rest of the screen */}
        <div
          style={{
            flex: "1 1 auto",
            marginLeft: "300px",
            padding: "1rem",
            width: "calc(100% - 330px)",
            height: "100%",
          }}
        >
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/local-searcher" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
