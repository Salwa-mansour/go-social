import { Outlet } from "react-router-dom";
import Nav from "./Nav";


const style = {
    appCss: {
       
        backgroundImage: " url('/juliette-paez-tobar.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "30% center",
        backgroundAttachment: "fixed",
    }
};

const Layout = () => {
    return (
        // 3. Reference it using style={style.appCss}
        <main className="App" style={style.appCss}>
            <Nav />
            <Outlet />
        </main>
    );
};

export default Layout;