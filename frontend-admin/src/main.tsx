import "@mantine/core/styles.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "@fontsource-variable/inter";
import "./index.css";

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router/dom";

import {createTheme, MantineProvider} from "@mantine/core";
import router from "./router.tsx";

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <RouterProvider router={router}/>
        </MantineProvider>
    </StrictMode>,
);
