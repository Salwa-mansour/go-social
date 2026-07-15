import { useAuth } from "../hooks/useAuth";
import CreatePost from "./post/Create";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostList from "./post/List";
import { useState, useEffect } from "react";

const Home = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { 
        let isMounted = true;
        const controller = new AbortController();

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axiosPrivate.get('/post/feed', {
                    signal: controller.signal
                });
                
                if (isMounted) {
                    setPosts(response.data);
                }
            } catch (err) {
                // Only handle the error if the request wasn't manually canceled
                if (err.name !== 'CanceledError' && isMounted) {
                    console.error(err);
                    setError("Failed to fetch posts. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false); 
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
            controller.abort();
        };

    }, [axiosPrivate]); 
    
    return (
        <section className="main-content">
        
            {/* <p>Welcome {auth?.username || 'Guest'}</p> */}
            <CreatePost />
            
            {loading && <p>Loading posts...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* Display list only when not loading */}
            {!loading && <PostList posts={posts} setPosts={setPosts} />}
        </section>
    );
};

export default Home;