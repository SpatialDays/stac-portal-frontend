// @mui components
import { Add, Delete, Edit, Refresh, ContentCopy, Visibility, VisibilityOff } from "@mui/icons-material";

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
          {buttonType === "refresh" && <Refresh />}
          {buttonType === "copy" && <ContentCopy />}
          {buttonType === "visibility" && <Visibility />}
          {buttonType === "visibility-off" && <VisibilityOff />}
        </span>
      )}
      {children}
    </button>
  );
};

export default MDButton;
