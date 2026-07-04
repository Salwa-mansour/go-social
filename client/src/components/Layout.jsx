import { Outlet } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import {Link}  from "react-router-dom";


const Layout = () => {
    return (
        <main className="App">
            <LogoutBtn />
            <Link to="/editprofile">edit Profile</Link>
            <Link to="/allUsers">discover</Link>
            <Link to="/pendingRequests"> Requests</Link>
            <Outlet />
        </main>
    )
}

export default Layout
