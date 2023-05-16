import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PageHeader = ({ title, children }) => (
  <Card className="card-title">
    <MDBox>
      <MDTypography variant="h4">{title}</MDTypography>
      {children}
    </MDBox>
  </Card>
);

export default PageHeader;
