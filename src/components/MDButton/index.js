// @mui components
import { Add, Delete, Edit } from "@mui/icons-material";

const MDButton = ({
  children,
  onClick,
  className,
  buttonType,
  style,
  noIcon,
  disabled,
  noText,
}) => {
  const buttonTypeClassName = buttonType ? `btn-${buttonType}` : "";
  const classes = `btn ${buttonTypeClassName} ${className}`;
  return (
    <button
      className={classes}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {!noIcon && (
        <span className="btn-icon">
          {buttonType === "create" && <Add />}
          {buttonType === "delete" && <Delete />}
          {buttonType === "update" && <Edit />}
        </span>
      )}
      {children}
    </button>
  );
};

export default MDButton;
