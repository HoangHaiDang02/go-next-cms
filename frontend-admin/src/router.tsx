import {createBrowserRouter} from "react-router";
import Home from "./pages/Home.tsx";
import {Layout} from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {index: true, Component: Home},
            {path: "/overview", Component: Home},
            {path: "/forecasts", Component: Home},
            {path: "/upcoming", Component: Home},
            {path: "/analytics", Component: Home},
            {path: "/contracts", Component: Home},
            {path: "/settings", Component: Home},
            {path: "/previous", Component: Home},
        ],
    },
]);

export default router;
