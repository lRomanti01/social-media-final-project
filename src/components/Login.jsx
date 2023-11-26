import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Login.css";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = `Login | SocialMedia`;
  }, []);

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success("Logged in successfully");
        Navigate("/");
      })
      .catch((error) => {
        toast.error("Failed to login");
      });
  };

  const signInEmail = (e) => {
    e.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        Navigate("/");
        toast.success("Logged in successfully");
      })
      .catch((error) => {
        toast.error("Failed to login");
      });
  };

  const register = (e) => {
    Navigate("/register");
  };

  return (
    <div className="login">
      <ToastContainer position="top-right" reverseOrder={false} />
      <div className="loginContainer">
        <Link to="/" className="link">
          <h1 className="loginLogo">SocialMedia</h1>
        </Link>
        <h1>Sign-in</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            onClick={signInEmail}
            className="loginSignInButton"
          >
            Sign In
          </button>
        </form>

        <button className="loginRegisterButton" onClick={register}>
          Register
        </button>

        <br />
        <h5>OR</h5>
        <button onClick={signIn} className="loginSignInButtonGoogle">
          <FcGoogle style={{ height: 30, width: 30 }} />{" "}
          <span style={{ display: "flex", justifyContent: "center" }}>
            Sign In with Google
          </span>
        </button>
      </div>
    </div>
  );
}

export default Login;
