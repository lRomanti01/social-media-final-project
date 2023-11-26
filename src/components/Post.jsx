import React, { useEffect, useState, useRef } from "react";
import { db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaComment } from "react-icons/fa";
import "../styles/Post.css";

function Post({ postId, post, user }) {
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    document.title = `Home | SocialMedia`;
  }, []);

  useEffect(() => {
    if (postId) {
      const commentsRef = collection(db, `posts/${postId}/comments`);
      const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));

      const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = [];
        snapshot.forEach((doc) => {
          commentsData.push(doc.data());
        });

        if (commentsData.length > 3) {
          setHasMoreComments(true);
        }
        setComments(commentsData.slice(Math.max(commentsData.length - 3, 0)));
      });

      return () => unsubscribeComments();
    }
  }, [postId]);

  useEffect(() => {
    if (postId && user) {
      const likesRef = collection(db, `users/${user.email}/likes`);

      const unsubscribeLikedPosts = onSnapshot(likesRef, (snapshot) => {
        const likedPostsData = snapshot.docs.map((doc) => doc.id);
        setLikedPosts(likedPostsData);

        if (likedPostsData.includes(postId)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });

      return () => unsubscribeLikedPosts();
    }
  }, [postId, user]);

  const changeHeart = () => {
    if (!user) {
      alert("Tienes que iniciar seccion");
      Navigate("/login");
    }
    if (postId && user) {
      const userLikesRef = doc(db, `users/${user.email}/likes`, postId);

      if (!isLiked) {
        setDoc(userLikesRef, { post: postId })
          .then(() => {
            setIsLiked(true);
          })
          .catch((error) => {
            console.error("Error liking: ", error);
          });
      } else {
        deleteDoc(userLikesRef)
          .then(() => {
            setIsLiked(false);
          })
          .catch((error) => {
            console.error("Error unliking: ", error);
          });
      }
    }
  };

  const postComment = async (event) => {
    event.preventDefault();
    try {
      const commentData = {
        text: comment,
        username: user.displayName || user.email.split("@")[0],
        timestamp: serverTimestamp(),
      };
      const commentRef = await addDoc(
        collection(db, `posts/${postId}/comments`),
        commentData
      );

      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div>
      {post && (
        <div className="post">
          <div className="postHeader">
            <img
              className="avatar"
              src={post.avatar}
              alt={post.username}
              title={post.username}
            />
            <Link to={`/profile/${post.email}`}>
              <h3 className="postUsername">{post.username}</h3>
            </Link>
          </div>
          {post.caption && <p className="postCaption">{post.caption}</p>}
          <Link to={`/post/${postId}`}>
            <img className="postImage" src={post.imageUrl} alt={postId} />
          </Link>

          <div className="postInteractionBar">
            {isLiked ? (
              <FaHeart
                className="postInteractionItem"
                onClick={changeHeart}
                id={postId}
              />
            ) : (
              <CiHeart
                className="postInteractionItem"
                onClick={changeHeart}
                id={postId}
              />
            )}
            <Link to={`/post/${postId}`}>
              <FaComment className="postInteractionItem" />
            </Link>
          </div>

          <div className="postCaption">
            {" "}
            <strong>Comment</strong>
          </div>
          <div className="postComments">
            {comments.map((comment, i) => (
              <p key={i} className="postCaptionComments">
                <strong>
                  <Link className="commentLink" to={`/profile/${post.email}`}>
                    {comment.username}
                  </Link>
                </strong>{" "}
                {comment.text}
              </p>
            ))}
            <Link to={`/post/${postId}`}>
              {hasMoreComments && (
                <p className="postCaption postMoreComments">
                  See all comments ...
                </p>
              )}
            </Link>
          </div>

          {user ? (
            <form className="postCommentsInput" onSubmit={postComment}>
              <input
                className="postComment"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="postCommentButton"
                type="submit"
                disabled={!comment}
              >
                {" "}
                Post{" "}
              </button>
            </form>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default Post;
