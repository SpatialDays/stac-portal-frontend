// react-router-dom components
import { useLocation } from "react-router-dom";

// STAC Portal components
import MDBox from "components/MDBox";
import Breadcrumbs from "components/Breadcrumbs";

function DashboardLayout({ children }) {
  const { pathname } = useLocation();

  // Remove forward slash and convert to title case
  let page = pathname.replace("/", "").replace(/-/g, " ");

  // Convert each word to title case
  page = page
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      <Breadcrumbs page={page} />
      <MDBox
        sx={({ transitions }) => ({
          p: 3,
          position: "relative",
          marginLeft: "274px",
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        })}
      >
        {children}
      </MDBox>
    </>
  );
}

export default DashboardLayout;
