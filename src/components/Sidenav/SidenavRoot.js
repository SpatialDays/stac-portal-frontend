// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(() => {
  return {
    "& .MuiDrawer-paper": {
      border: "none",
      background: "linear-gradient(180deg, #453C90 0%, #191636 100%)",
      margin: "1em",
      width: "220px",
      height: "calc(100vh - 4em)",
      borderRadius: "10px",
      overflowX: "hidden",
      transform: "translateX(10px)",
      padding: "1em",
    },
  };
});
