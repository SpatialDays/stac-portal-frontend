// React
import { useState } from "react";

// @mui components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";

export const FindMoreCollections = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add Collection</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
            }}
          >
            <TextField
              label="Collection URL"
              variant="outlined"
              fullWidth
              // margin top
              sx={{ mt: 1 }}
              value={values.url}
              onChange={(e) => setValues({ ...values, url: e.target.value })}
            />

            <TextField
              label="Collection Name (Optional)"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            <small>Takes the default collection name if not supplied</small>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} sx={{ color: "white!important" }}>
          Add New STAC Collection
        </Button>
      </DialogActions>
    </Dialog>
  );
};
