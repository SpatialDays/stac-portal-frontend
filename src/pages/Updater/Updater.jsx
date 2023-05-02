// React
import React, { useEffect, useMemo, useState } from "react";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Table from "components/Table";
import MDButton from "components/MDButton";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

// Layout components
import DashboardLayout from "layout/LayoutContainers/DashboardLayout";

// Interface
import {
  getAllStoredSearchParameters,
  runStoredSearchParamUpdate,
} from "interface/collections";


const Updater = () => {
  const [params, setParams] = useState([]);
  // Retrieve Collection Data
  useEffect(() => {
    async function getParams() {
      let data = await getAllStoredSearchParameters();
      setParams(data);
    }

    getParams();
  }, []);

  // Table Columns
  const paramsColumns = useMemo(() => [
    {
      accessorFn: (row) => {
        return row.parentCatalogName;
      },
      header: "Catalog",
      size: 200,
    },
    {
      accessorFn: (row) => {
        return row.collection;
      },
      header: "Collection",
      size: 180, //medium column
    },
    {
      accessorFn: (row) => {
        return row.bbox.join(", ");
      },
      header: "Spatial Extent",
      size: 100, //medium column
    },
    {
      accessorFn: (row) => {
        // Returns: 2021-11-22T00:00:00Z/2022-11-22T00:00:00Z
        // Want: 2021-11-22 to 2022-11-22
        let datetime = row.datetime.split("/");
        let start = datetime[0].split("T")[0];
        let end = datetime[1].split("T")[0];
        return `${start} / ${end}`;
      },
      header: "Temporal Extent",
      size: 180, //medium column
    },
    {
      accessorFn: (row) => {
        return (
          <MDButton
            buttonType={"update"}
            noIcon
            onClick={() => {
              runStoredSearchParamUpdate(row.id);
              alert(`Updating ${row.collection} from ${row.parentCatalogName}`);
            }}
          >
            <CloudSyncIcon sx={{ mr: 1 }} />
            Update
          </MDButton>
        );
      },
      header: "Update",
      size: 100, //medium column
    },
  ]);
  const columnOrder = [
    "Catalog",
    "Collection",
    "Spatial Extent",
    "Temporal Extent",
    "Update",
  ];

  return (
    <DashboardLayout>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="card-title">
              <MDBox>
                <MDTypography variant="h4">Update Collection</MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Table
              columns={paramsColumns}
              gray
              columnOrder={columnOrder}
              data={params}
              rowClickAction={(row, table) => {}}
              rowsPerPage={20}
              title="Search Parameters"
            />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Updater;
