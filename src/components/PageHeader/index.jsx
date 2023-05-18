import { Card, Tooltip, Divider, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PageHeader = ({ title, subtitle, children }) => (
  <Card className="card-title" sx={{ p: 2 }}>
    <MDBox>
      <MDTypography variant="h4" sx={{ mb: 1 }}>
        {title}
      </MDTypography>
      <MDTypography variant="small" className="">{subtitle}</MDTypography>
      {children}
    </MDBox>
  </Card>
);

export default PageHeader;
