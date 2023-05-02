// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// @mui material components
import List from "@mui/material/List";
import Link from "@mui/material/Link";

// STAC Portal components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout components
import SidenavCollapse from "components/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "components//Sidenav/SidenavRoot";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

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
          <NavLink key={key} to={route}>
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

  return (
    <SidenavRoot {...rest} variant="permanent">
      <MDBox>
        <MDBox sx={{ cursor: "pointer" }}></MDBox>
        <MDBox component={NavLink} to="/">
          {brand && (
            <a href="/">
              <img src={brand} alt="brand" className="sidenav-brand" />
            </a>
          )}
          <MDBox>
            <a href="/">
              <MDTypography
                component="h6"
                variant="button"
                fontWeight="medium"
                className="sidenav-title"
                color="white"
              >
                {brandName}
              </MDTypography>
            </a>
          </MDBox>
        </MDBox>
      </MDBox>
      <hr></hr>
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

export default Sidenav;
