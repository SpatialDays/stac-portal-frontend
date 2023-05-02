// React
import { forwardRef, createElement } from "react";

const MDTypography = forwardRef(
  (
    {
      color,
      fontWeight,
      textTransform,
      verticalAlign,
      textGradient,
      opacity,
      children,
      variant,
      component,
      sx,
      ...rest
    },
    ref
  ) => {
    //if component is not defined, use the variant as the component
    if (!component) {
      component = variant;
    }

    return (
      <span ref={ref} {...rest}>
        {createElement(
          component,
          {
            style: {
              color,
              fontWeight,
              textTransform,
              verticalAlign,
              textGradient,
              opacity,
              ...sx,
            },
          },
          children
        )}
      </span>
    );
  }
);

export default MDTypography;
