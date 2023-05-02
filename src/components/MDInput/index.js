// @mui components
import { TextField } from "@mui/material";

const MDInput = ({ error, success, disabled, ...rest }) => (
  <TextField
    error={error}
    disabled={disabled}
    helperText={error}
    className="form-input"
    size="small"
    InputLabelProps={{
      sx: {
        color: "#7B809A",
        fontSize: "14px",
      },
    }}
    inputProps={{
      style: {
        fontSize: "14px",
      },
    }}
    {...rest}
  />
);

export default MDInput;
