// React
import React, { useState } from "react";

// Components
import DrawMap from "../../components/DrawMap";
import PublicCollections from "./components/PublicCollections";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// @mui components
import Grid from "@mui/material/Grid";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

const PublicCollectionsSearcher = () => {
  const [AOI, setAOI] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [publicCollections, setPublicCollections] = useState([]);

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDTypography variant="overline" gutterBottom>
              Use the Area Downloader to choose a date range and geographic area
              to download STAC data from.
            </MDTypography>
          </Grid>

          <Grid item xs={12}>
            <MDBox>
              <DrawMap
                AOI={AOI}
                setAOI={setAOI}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setPublicCollections={setPublicCollections}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <PublicCollections
                collections={publicCollections}
                AOI={AOI}
                startDate={startDate}
                endDate={endDate}
              />
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};
export default PublicCollectionsSearcher;
