// React
import { forwardRef } from "react";

const MDBox = forwardRef(({ children, ...rest }, ref) => {
  // If sx in rest
  if (rest.sx) {
    delete rest.sx;
  }
  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
});

export default MDBox;
