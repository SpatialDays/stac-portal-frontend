// React
import React, { useMemo } from "react";

// Components
import Table from "components/Table";
import CustomWidthTooltip from "components/Tooltip/CustomWidthTooltip";
import MDButton from "components/MDButton";

// Utils
import { shortenDescription } from "../TableUtils";

// Interface
import {
  deleteCollection,
  retrieveAllCollections,
} from "interface/collections";

const DownloadedCollections = ({ collections, setCollections }) => {
  // Table Columns
  const collectionColumns = useMemo(() => [
    {
      accessorFn: (row) => {
        return row.id;
      },
      header: "ID",
      size: 10,
    },
    {
      accessorFn: (row) => {
        return row.title;
      },
      header: "Title",
      size: 200,
    },
    {
      accessorFn: (row) => {
        let typeOfCollection = row["stac-portal-metadata"]["type-of-collection"];
        const commonNames = {
          "public": "Public Collection",
          "private": "Private Collection",
          "bulk-upload-system": "Bulk Upload System Collection"
        }
        if (commonNames[typeOfCollection]) {
          return commonNames[typeOfCollection];
        }
        else {
          return typeOfCollection;
        }
      },
      header: "Type",
      size: 100,
    },
    {
      accessorFn: (row) => {
        // Add a tooltip that shows the full description
        return (
          <CustomWidthTooltip
            title={row.description}
            disableTouchListener={false}
            disableFocusListener={false}
            enterDelay={1000}
          >
            <div>{shortenDescription(row.description)}</div>
          </CustomWidthTooltip>
        );
      },
      header: "Description",
      size: 180, //medium column
    },
    {
      accessorFn: (row) => {
        if (row.license) {
          return row.license.charAt(0).toUpperCase() + row.license.slice(1);
        }
        return row.license;
      },
      header: "License",
      size: 100, //medium column
    },
    {
      accessorKey: "stac_version",
      header: "STAC Version",
      size: 20,
    },
    {
      accessorFn: (row) => {
        return (
          <MDButton
            buttonType={"delete"}
            noText
            onClick={async () => {
              // ask the user are they sure they want to delete
              let confirmation = window.confirm(
                `Are you sure you want to delete ${row.id} collection?`
              );
              if (confirmation) {
                await deleteCollection(row.id);
                let collectionsOnStac = await retrieveAllCollections();
                setCollections(collectionsOnStac.collections);
              }
            }}
          >
            Delete
          </MDButton>
        );
      },
      header: "Delete",
      size: 10,
    },
  ]);
  const columnOrder = [
    "ID",
    "Title",
    "Type",
    "Description",
    "License",
    "stac_version",
  ];

  return (
    <Table
      columns={collectionColumns}
      gray
      columnOrder={columnOrder}
      data={collections}
      title="Collections"
      rowsPerPage={20}
    />
  );
};

export default DownloadedCollections;
