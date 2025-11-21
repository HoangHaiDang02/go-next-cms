import {Header} from "../Header";
import {Outlet} from "react-router";
import {Navbar} from "../Navbar";

export function Layout() {
    return (
        <>
            <Header/>
            <main className="main">
                <Navbar/>
                <Outlet/>
            </main>
        </>
    );
}

