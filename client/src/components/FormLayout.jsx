import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { Outlet } from "react-router-dom";



const style = {
    appCss: {
       
        backgroundImage: " url('/juliette-paez-tobar.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "30% center",
        backgroundAttachment: "fixed",
        width:"100%",
        justifyContent:"center"
    }
};

const FromLayout = () => {
    return (
        // 3. Reference it using style={style.appCss}
        <main className="App" style={style.appCss}>
          
            <Outlet />
        </main>
    );
};

export default FromLayout;