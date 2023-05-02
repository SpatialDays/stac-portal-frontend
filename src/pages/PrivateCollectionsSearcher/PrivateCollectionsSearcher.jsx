// Components
import MDBox from "components/MDBox";

// Layout
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";
import Iframe from "react-iframe";

// Styles
import "./style.scss";

const PrivateCollectionsSearcher = () => {
  return (
    <>
      <DashboardLayout>
        <MDBox
          style={{
            width: "100%",
            height: "83vh",
          }}
        >
          <Iframe
            src={process.env.REACT_APP_PORTAL_STAC_API_BROWSER_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            id="stac-browser-iframe"
            onError={(e) => {
              console.log(e);
            }}
          />
        </MDBox>
      </DashboardLayout>
    </>
  );
};

export default PrivateCollectionsSearcher;
