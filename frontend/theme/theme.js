import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF0000",
    },
  },
  fonts: {
    // Default font family
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: 'hsla(0, 0%, 0%, 1)',
      },
    }),
  },
  components: {
    // UI components offered by Chakra
    Button,
  },
});