// React
import React, { useEffect, useState } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// STAC Portal components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DownloadedCollections from "./components/DownloadedCollections";
import PageHeader from "components/PageHeader";

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
            <PageHeader title="Local Catalog"></PageHeader>
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
