// @mui components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { CircularProgress } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const Progress = ({ files }) => {
  const completedFiles = files.filter((file) => file.complete);

  return (
    <>
      {/* One side for processing, other side for completed */}
      <MDBox
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Processing */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "50%",
            minWidth: "400px",
          }}
          id="processing"
        >
          <MDTypography variant="h5">Processing</MDTypography>
          <MDTypography variant="overline">
            {files.length - completedFiles.length} files remaining
          </MDTypography>
          {/* List all processing files */}
          <MDBox
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "1rem",
              height: "250px",
            }}
          >
            <MDBox
              style={{
                // Scroll bar
                overflowY: "scroll",
                height: "100%",
                width: "100%",
                border: "1px dotted #ccc",
                paddingTop: "0.5em",
              }}
            >
              {files.map((file) => {
                if (!file.complete) {
                  return (
                    <MDBox
                      key={Math.random().toString(36).substring(7)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingLeft: "2em",
                        paddingRight: "2em",
                        boxSizing: "border-box",
                        height: "1.5em",
                      }}
                      onClick={() => console.log("clicked", file)}
                    >
                      <MDTypography variant="overline">
                        {file.originalName}
                      </MDTypography>
                      {/* If file.started then show Progress Circle */}
                      <MDBox>
                        {file.started ? (
                          <CircularProgress
                            sx={{
                              color: "#54A19A",
                            }}
                            size={15}
                          />
                        ) : // If file error then show error icon
                        file.error ? (
                          <MDTypography variant="overline">
                            {file.errorMessage}
                          </MDTypography>
                        ) : (
                          <MDTypography variant="overline">
                            Waiting
                          </MDTypography>
                        )}
                      </MDBox>
                    </MDBox>
                  );
                }
              })}
            </MDBox>
          </MDBox>
        </MDBox>
        {/* Completed */}
        <MDBox
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "50%",
            height: "100%",
          }}
          id="completed"
        >
          <MDTypography variant="h5">Completed</MDTypography>
          <MDTypography variant="overline">
            {completedFiles.length} files completed
          </MDTypography>
          {/* List all completed files */}
          <MDBox
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "1rem",
              height: "250px",
            }}
          >
            <MDBox
              style={{
                // Scroll bar
                overflowY: "scroll",
                height: "100%",
                width: "100%",
                border: "1px dotted #ccc",
                paddingTop: "0.5em",
              }}
            >
              {files.map((file) => {
                if (file.complete) {
                  return (
                    <MDBox
                      key={Math.random().toString(36).substring(7)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingLeft: "2em",
                        paddingRight: "2em",
                        boxSizing: "border-box",
                        height: "1.5em",
                      }}
                    >
                      <MDTypography variant="overline">
                        {file.originalName}
                      </MDTypography>
                      <DoneIcon
                        sx={{
                          color: "#54A19A",
                        }}
                      />
                    </MDBox>
                  );
                }
              })}
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
};
export default Progress;
