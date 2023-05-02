// React
import React, { useEffect, useState } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// STAC Portal components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DownloadedCollections from "./components/DownloadedCollections";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// Interface
import { retrieveAllCollections } from "interface/collections";

const DisplayCollections = () => {
  const [downloadedCollections, setDownloadedCollections] = useState([]);
  useEffect(() => {
    async function getCollections() {
      let collectionsOnStac = await retrieveAllCollections();
      setDownloadedCollections(collectionsOnStac.collections);
    }

    getCollections();
  }, []);

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="card-title">
              <MDBox>
                <MDTypography variant="h4">Local Catalog</MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <DownloadedCollections
              collections={downloadedCollections}
              setCollections={setDownloadedCollections}
            />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default DisplayCollections;
