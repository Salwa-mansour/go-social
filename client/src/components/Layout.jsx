import { Outlet } from "react-router-dom";
import Nave from "./Nav";

const Layout = () => {
    return (
        <main className="App">
            <Nave />
            <Outlet />
        </main>
    )
}

export default Layout
