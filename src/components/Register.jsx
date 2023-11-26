import React, { useEffect, useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const Navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  useEffect(() => {
    document.title = `Register | SocialMedia`; 
  }, []); 
  
  const signIn = () => {
    signInWithPopup(auth, provider) 
      .then((result) => {
        console.log(result)
        Navigate("/");
      })
      .catch((error) => {
        
      });
  };
  
  const signInEmail = (e) => {
    e.preventDefault(); 
    signInWithEmailAndPassword(auth, email, password)
    .then((authUser) => {
      Navigate("/register"); 
      })
      .catch((error) => alert(error.message)); 
  };

  const register = (e) => {
    e.preventDefault();
  
    // createUserWithEmailAndPassword(auth, email, password) 
    //   .then((authUser) => {
    //     if (authUser) { 
    //       Navigate("/");
    //     }
    //   })
    //   .catch((error) => alert(error.message)); 
  };

  return (
    <div className="Register">
      <div className="RegisterContainer">
        <Link to="/" className="link">
          <h1 className="RegisterLogo">SocialMedia</h1>
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
            className="RegisterSignInButton"
          >
            Sign In
          </button>
        </form>

        <button className="RegisterRegisterButton" onClick={register}>
          Register
        </button>

        <br/><h5>OR</h5>
        <button onClick={signIn} className="RegisterSignInButtonGoogle">
          <i className="fab fa-google"></i> Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default Register;