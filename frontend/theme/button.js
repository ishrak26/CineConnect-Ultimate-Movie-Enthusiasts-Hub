export const Button = {
    baseStyle: {
      // Base styles applied to all variants
      borderRadius: "10px",
      fontSize: "10pt",
      fontWeight: 700,
      _focus: {
        boxShadow: "none",
      },
      _hover: { boxShadow: "lg" },
    },
    sizes: {
      sm: {
        fontSize: "8pt",
      },
      md: {
        fontSize: "10pt",
        // height: "28px",
      },
    },
    // Different visual variants of the button
    variants: {
      solid: {
        // Default button
        color: "white",
        bg: "red.500",
        _hover: {
          bg: "red.400",
        },
      },
      outline: {
        color: "red.500",
        border: "1px solid",
        borderColor: "red.500",
        _hover: {
          bg: "red.50",
        },
      },
      oauth: {
        height: "34px",
        border: "1px solid",
        borderColor: "gray.300",
        _hover: {
          bg: "gray.50",
          borderColor: "red.400",
        },
      },
      action: {
        height: "34px",
        border: "1px solid",
        borderColor: "white",
        _hover: {
          bg: "gray.50",
          borderColor: "red.400",
        },
      },
    },
  };
  