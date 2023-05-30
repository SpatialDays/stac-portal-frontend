// React
import { useState, useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// @mui material components
import List from "@mui/material/List";
import Link from "@mui/material/Link";

// material icons
import MenuIcon from '@mui/icons-material/Menu';

// STAC Portal components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout components
import SidenavCollapse from "components/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "components//Sidenav/SidenavRoot";
import MDButton from "components/MDButton";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  // adding in a state for whether the sidenav should be collapsed or not (for mobile)
  const mobileScreenSize = 768;
  const [mobileSidenav, setMobileSidenav] = useState(document.documentElement.clientWidth <= mobileScreenSize);
  const [hideMobileNav, setHideMobileNav] = useState(true);

  // sets mobileSidenav to true/false depending on the window size
  useEffect(() => {
    const handleResize = () => {
      console.log(document.documentElement.clientWidth);
      setMobileSidenav(document.documentElement.clientWidth <= mobileScreenSize);
      setHideMobileNav(document.documentElement.clientWidth <= mobileScreenSize);
    };
  
    // Set initial state
    setMobileSidenav(document.documentElement.clientWidth <= mobileScreenSize); 
    setHideMobileNav(document.documentElement.clientWidth <= mobileScreenSize);
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // if the screen is mobile size add the mobile-display class to the element with id="content-display"
  useEffect(() => {
    const displayElement = document.getElementById("content-display");
    if (mobileSidenav) {
      displayElement.classList.add("mobile-display");
    } else {
      displayElement.classList.remove("mobile-display");
    }

  }, [mobileSidenav]);

  const renderRoutes = routes.map(
    ({ type, name, icon, title, key, href, route }) => {
      let returnValue;

      if (!key) {
        key = Math.random();
      }

      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              selected={key === collapseName}
            />
          </Link>
        ) : (
          // when a link is clicked the link list is hidden if the screen is mobile size
          <NavLink key={key} to={route} onClick={() => setHideMobileNav=mobileSidenav}>
            <SidenavCollapse
              name={name}
              icon={icon}
              selected={key === collapseName}
            />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            display="block"
            variant="span"
            fontWeight="bold"
            textTransform="uppercase"
            color="white"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              marginTop: "1.4rem",
              marginBottom: "0.4rem",
              marginLeft: "1rem",
            }}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = <hr key={key}></hr>;
      } else {
        returnValue = <div key={key} />;
      }
      return returnValue;
    }
  );

  return(
      <SidenavRoot variant="permanent" className="root-sidenav">
        <MDBox>
          <MDBox to="/" className="sidenav-brand-container">  
            <a href="/">
              <img src={brand} alt="brand" className="sidenav-brand" />
            </a>
          </MDBox>
        </MDBox>
          {/* button for toggling the mobile menu */}
          {mobileSidenav && (
            <MDBox>
              <MDButton
                className="mobile-menu-button"
                onClick={() => setHideMobileNav(!hideMobileNav)}
              >
                <MenuIcon className="mobile-menu-icon"></MenuIcon>
              </MDButton>
            </MDBox>
          )}
        {!hideMobileNav && <hr></hr>}
        {!hideMobileNav && <List>{renderRoutes}</List>}
      </SidenavRoot>
  );
}

export default Sidenav;
