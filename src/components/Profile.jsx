import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Profile.css";
import { useStateValue } from "../StateProvider";
import Post from "./Post";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function Profile() {
  const { userid } = useParams();
  const [posts, setPosts] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const Navigate = useNavigate();

  useEffect(() => {
    document.title = `${posts[0]?.post.username} | SocialMedia`;
  }, [posts[0]?.post.username]);

  useEffect(() => {
    if (userid === "undefined") {
      Navigate("/");
    }

    if (userid) {
      const q = query(
        collection(db, "posts"),
        where("email", "==", userid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const filteredPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));
        setPosts(filteredPosts);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [userid]);

  return (
    <div>
      <div className="profileContainer">
        <img
          className="profileAvatar"
          src={posts[0]?.post.avatar}
          alt="avatar"
        />
        <h2 className="profileName">{posts[0]?.post.username}</h2>
      </div>

      <div className="posts">
        {posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
