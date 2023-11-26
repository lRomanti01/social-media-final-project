import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Register.css";

function Register() {
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = `Register | SocialMedia`;
  }, []);

  const registerUser = async (e) => {
    try {
      e.preventDefault();
      if (!username || !name || !lastName || !email || !password) {
        toast.error("All fields must be completed");
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      await updateProfile(user, {
        displayName: `${name} ${lastName}`,
        username: username,
      });

      toast.success("Logged in successfully");
      Navigate("/");
    } catch (error) {
      toast.error(error);
      toast.error("Failed to sign up");
    }
  };

  return (
    <div className="Register">
      <ToastContainer position="top-right" reverseOrder={false} />
      <div className="RegisterContainer">
        <Link to="/" className="link">
          <h1 className="RegisterLogo">SocialMedia</h1>
        </Link>
        <h1>Sign-up</h1>

        <form>
          <h5>Name</h5>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h5>Lastname</h5>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <h5>Username</h5>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
            className="RegisterButton"
            onClick={registerUser}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
