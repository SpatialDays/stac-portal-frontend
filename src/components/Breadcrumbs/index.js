// @mui components
import { Home, ChevronRight } from "@mui/icons-material";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import CustomWidthTooltip from "components/Tooltip/CustomWidthTooltip";

// Styles
import "./style.scss";

const Breadcrumbs = ({ page }) => {
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs__container">
        <div
          className="breadcrumbs__container__item"
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }}
        >
          <Home />
          <span className="breadcrumbs__container__item__text">Home</span>
        </div>
        <div className="breadcrumbs__container__item">
          <ChevronRight />
          <span className="breadcrumbs__container__item__text">{page}</span>
        </div>
      </div>
      <div className="breadcrumbs__container">
        <CustomWidthTooltip title="Logout" placement="bottom" arrow>
          <LogoutIcon
            style={{
              marginRight: "5px",
              color: "#e18080",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = "/.auth/logout")}
          />
        </CustomWidthTooltip>
      </div>
    </div>
  );
};

export default Breadcrumbs;
