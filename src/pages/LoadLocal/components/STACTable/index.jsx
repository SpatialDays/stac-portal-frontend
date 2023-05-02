// Reac
import { useState, useEffect } from "react";

// @mui components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { CircularProgress } from "@mui/material";

// Styles
import "./style.scss";

import { groupFilesByID } from "pages/LoadLocal/utils";
import { JSONTree } from "react-json-tree";

const STACTable = ({ files, stac }) => {
  const [rows, setRows] = useState(files);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    // Get an array of all the unique item IDs and how many times they appear but not if item id is empty
    const itemIDs = groupFilesByID(files);
    setRows(itemIDs);
  }, [files]);

  // If none selected, select first row
  useEffect(() => {
    if (selectedRows.length === 0 && rows.length > 0) {
      const id = rows[0].itemID;
      setSelectedId(id);
      setSelectedRows(rows[0].files);
    }
  }, [rows, selectedRows]);

  return (
    <>
      {/* Split into two parts the left lists the item IDS, when clicked on show more on the right side */}
      <MDBox
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          border: "1px solid #54A19A60",
          borderRadius: "2px",
        }}
      >
        {/* Left Side */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "30%",
            height: "100%",
          }}
        >
          <MDBox
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              padding: "0.4em 1em",
              borderBottom: "1px solid #54A19A60",
            }}
          >
            <MDTypography
              variant="h5"
              style={{
                fontSize: "0.8em",
              }}
            >
              Items
            </MDTypography>
          </MDBox>
          {/* List all item IDs */}
          <MDBox
            style={{
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            {rows.map((row) => {
              return (
                <MDBox
                  className={`stac-table-item-row ${
                    selectedId === row.itemID
                      ? "stac-table-item-row-selected"
                      : ""
                  }`}
                  key={"r" + row.name}
                  onClick={() => {
                    // Get all rows with the same item ID
                    const selectedRows = files.filter(
                      (file) => file.itemID === row.itemID
                    );
                    setSelectedRows(selectedRows);
                    setSelectedId(row.itemID);
                  }}
                >
                  <MDTypography variant="h6">{row.itemID}</MDTypography>
                  <MDBox>
                    {/* If stac state doesnt contain item ID */}
                    {stac[row.itemID] === undefined ? (
                      <CircularProgress
                        size={20}
                        style={{
                          // Color white if selected, otherwise color blue
                          color: selectedId === row.itemID ? "#fff" : "#54A19A",
                        }}
                      />
                    ) : (
                      <MDTypography variant="h6">{row.count}</MDTypography>
                    )}
                  </MDBox>
                </MDBox>
              );
            })}
          </MDBox>
        </MDBox>
        {/* Right Side */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "70%",
            height: "100%",
            boxSizing: "border-box",
            borderLeft: "1px solid #54A19A60",
          }}
        >
          <MDBox
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              padding: "0.4em 1em",
              borderBottom: "1px solid #54A19A60",
            }}
          >
            <MDTypography
              variant="h5"
              style={{
                fontSize: "0.8em",
              }}
            >
              Files
            </MDTypography>
          </MDBox>
          {/* List all files */}
          <MDBox
            style={{
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              padding: "1em",
              minHeight: "300px",
            }}
          >
            {/* If selected rows */}
            {selectedRows.length > 0 ? (
              // A scroll with max height 200px
              <>
                <MDTypography
                  variant="h6"
                  sx={{
                    marginBottom: "1em",
                  }}
                >
                  Assets
                </MDTypography>

                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    height: "100%",
                    overflowY: "scroll",
                    maxHeight: "200px",
                    border: "1px solid #54A19A60",
                    borderRadius: "5px",
                  }}
                >
                  {/* Map selectedRows, order by size */}
                  {selectedRows
                    .sort((a, b) => b.size - a.size)
                    .map((row) => {
                      const kb = row.size / 1024;

                      // Round down to 2 decimal places
                      const size = Math.floor(kb * 100) / 100;

                      return (
                        <MDBox
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                            borderBottom: "0.2px solid #54A19A30",
                            padding: "0 2.5em",
                          }}
                          className="stac-table-asset-row"
                          key={"a" + row.name}
                          onClick={() => {
                            console.log(row);
                          }}
                        >
                          <MDTypography variant="overline">
                            {row.name}
                          </MDTypography>
                          <MDTypography variant="overline">
                            {size} kB
                          </MDTypography>
                        </MDBox>
                      );
                    })}
                </MDBox>

                {/* Massive text field that shows the JSON output */}
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    marginTop: "1em",
                  }}
                >
                  <MDTypography
                    variant="h6"
                    sx={{
                      marginBottom: "1em",
                    }}
                  >
                    STAC Item Record
                  </MDTypography>{" "}
                  <MDBox
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      width: "100%",
                      height: "100%",
                      boxSizing: "border-box",
                      padding: "1em",
                      border: "1px solid #54A19A",
                      borderRadius: "5px",
                    }}
                  >
                    {/* {JSON.stringify(stac[selectedId], null, 2)} */}
                    {/* If Stac itemID */}
                    {stac[selectedId] ? (
                      <JSONTree
                        data={stac[selectedId]}
                        theme={{
                          scheme: "apathy",
                          // full width
                          // Padding
                          // Border
                          tree: {
                            width: "100%",
                            padding: "1.5em",
                            boxSizing: "border-box",
                          },
                        }}
                        invertTheme={true}
                        shouldExpandNode={() => true}
                      />
                    ) : (
                      <MDBox
                        style={{
                          width: "100%",
                          // Align center
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <CircularProgress
                          style={{
                            color: "#54A19A",
                            marginBottom: "1em",
                          }}
                        />
                        <MDTypography variant="overline">
                          Generating STAC Item Record
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </MDBox>
              </>
            ) : (
              <MDTypography variant="overline">No files selected</MDTypography>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
};
export default STACTable;
