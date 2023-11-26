import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Post from "./components/Post";
import SinglePost from "./components/SinglePost";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Footer from "./components/Footer";
import { db, auth } from "./config/firebase";
import "./App.css";
import { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import Register from "./components/Register";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <div className="filter"></div>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<SinglePost user={user} />} />
          <Route path="/profile/:userid" element={<Profile />} />
          <Route path="/" element={<HomePage posts={posts} user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

// New feature to render home page content
function HomePage({ posts, user }) {
  return (
    <>
      <div className="posts">
        <Upload user={user} />
        {posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} post={post} />
        ))}
      </div>
    </>
  );
}

export default App;
