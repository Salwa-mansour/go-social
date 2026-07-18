import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useAuth } from '../hooks/useAuth'; // 💡 Import your auth hook
import Nav from './Nav';

const style = {
    appCss: {
        backgroundImage: " url('/juliette-paez-tobar.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "30% center",
        backgroundAttachment: "fixed",
    }
};

const Layout = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // 💡 Grab auth state profile tokens
  const [requests, setRequests] = useState([]);
   
  useEffect(() => {
    // 💡 Guard Clause: Do not hit the server until access tokens exist
    if (!auth?.accessToken) return;

    let isMounted = true;
    axiosPrivate.get('/user/requests')
      .then(res => {
         if (isMounted)
         setRequests(res.data); 
        })
      .catch(err => console.error(err));
      
    return () => { isMounted = false; };
  }, [axiosPrivate, auth?.accessToken]); // 💡 Add token tracking dependency

    return (
        <main className="App" style={style.appCss}>
            <Nav requestCount={requests.length} />
            <Outlet context={{ requests, setRequests }} />
        </main>
    );
};

export default Layout;