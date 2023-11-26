import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../styles/SinglePost.css";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";

function SinglePost({ user }) {
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const commentsQuery = query(
        collection(db, `posts/${id}/comments`),
        orderBy("timestamp", "asc")
      );
      const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
      return () => unsubscribeComments();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const postDoc = await getDoc(doc(db, `posts/${id}`));
          if (postDoc.exists()) {
            setPost(postDoc.data());
            console.log(postDoc.data());
          } else {
            console.log("El documento no existe");
          }
        } catch (error) {
          console.error("Error obteniendo el documento:", error);
        }
      };

      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (id && user) {
      const unsubscribeLikedPosts = onSnapshot(
        collection(db, `users/${user.email}/likes`),
        (snapshot) => {
          setLikedPosts(snapshot.docs.map((doc) => doc.id));
        }
      );

      if (likedPosts.includes(id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      return () => unsubscribeLikedPosts();
    }
  }, [id, likedPosts.length, user]);

  const postComment = async (event) => {
    event.preventDefault();
    if (id && user) {
      const commentData = {
        text: comment,
        username: user.displayName || user.email.split("@")[0],
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, `posts/${id}/comments`), commentData);
      setComment("");
    }
  };

  const changeHeart = async () => {
    if (id && user) {
      const userLikesRef = doc(db, `users/${user.email}/likes/${id}`);

      if (!isLiked) {
        setDoc(userLikesRef, { post: id })
          .then(() => {
            setIsLiked(true);
            console.log("Liked Photo!");
          })
          .catch((error) => {
            console.error("Error liking: ", error);
          });
      } else {
        deleteDoc(userLikesRef)
          .then(() => {
            setIsLiked(false);
            console.log("Unliked Photo!");
          })
          .catch((error) => {
            console.error("Error unliking: ", error);
          });
      }
    }
  };

  return (
    post && (
      <div className="singlePostContainer">
        <div className="singlePost">
          <img className="singlePostImage" src={post.imageUrl} alt={id} />

          <div className="singlePostRight">
            <div className="postHeader">
              <img
                className="avatar"
                src={post.avatar}
                alt={post.username}
                title={post.username}
              />
              <Link className="commentLink" to={`/profile/${post.email}`}>
                <h3 className="postUsername">{post.username}</h3>
              </Link>
            </div>
            <div className="postComments singlePostComments">
              {post.caption && (
                <p className="postCaptionSingle">{post.caption}</p>
              )}

              <div className="postInteractionBar singlePostInteractionBar">
                {isLiked ? (
                  <FaHeart
                    className="postInteractionItem postHeart"
                    onClick={changeHeart}
                    id={id}
                  />
                ) : (
                  <CiHeart
                    className="postInteractionItem postHeart"
                    onClick={changeHeart}
                    id={id}
                  />
                )}
              </div>
              <div className="postCommentsSingle">
                {comments.map((comment, i) => (
                  <p key={i} className="postCaption">
                    <strong>
                      <Link
                        className="commentLink"
                        to={`/profile/${post.email}`}
                      >
                        {comment.username}
                      </Link>
                    </strong>{" "}
                    {comment.text}
                  </p>
                ))}
              </div>
            </div>

            {user ? (
              <form className="postCommentsInput">
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
                  onClick={postComment}
                >
                  {" "}
                  Post{" "}
                </button>
              </form>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default SinglePost;
