// @mui components
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/system";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 1000,
  },
});
export default CustomWidthTooltip;
