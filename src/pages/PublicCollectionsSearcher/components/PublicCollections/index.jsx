// React
import React, { useMemo } from "react";

// Components
import Table from "components/Table";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import CustomWidthTooltip from "components/Tooltip/CustomWidthTooltip";

// @mui components
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

// Interface
import { callSelectiveIngester } from "interface/collections";

// Utils
import { shortenDescription } from "../TableUtils";

const PublicCollections = ({ collections, AOI, startDate, endDate }) => {
  const collectionColumns = useMemo(() => [
    {
      accessorFn: (row) => {
        return shortenDescription(row.title, 40);
      },
      header: "Title",
      size: 5,
    },
    {
      accessorFn: (row) => {
        return (
          <CustomWidthTooltip
            title={row.description}
            disableTouchListener={false}
            disableFocusListener={false}
            enterDelay={1000}
          >
            <div>{shortenDescription(row.description, 90)}</div>
          </CustomWidthTooltip>
        );
      },
      header: "Description",
      size: 180, //medium column
    },
    {
      accessorFn: (row) => {
        //return row.catalog.name;
        return row.parent_catalog_name;
      },
      header: "Catalog",
      size: 200,
    },
    {
      accessorFn: (row) => {
        return (
          <MDButton
            buttonType="create"
            noIcon
            onClick={() => {
              const parentCatalogId = String(row.parent_catalog);
              const collectionId = String(row.id);
              callSelectiveIngester(
                parentCatalogId,
                collectionId,
                AOI,
                startDate,
                endDate
              );
              alert(`Ingesting ${row.title} from ${row.parent_catalog}...`);
            }}
          >
            <CloudDownloadIcon
              sx={{
                mr: 2,
              }}
            />
            Load
          </MDButton>
        );
      },
      header: "Load",
      size: 100,
    },
  ]);
  const columnOrder = ["Title", "Description", "Catalog", "Load"];

  return (
    <MDBox>
      <Table
        columns={collectionColumns}
        gray
        columnOrder={columnOrder}
        data={collections}
        title="Collections"
        rowsPerPage={20}
      />
    </MDBox>
  );
};

export default PublicCollections;
