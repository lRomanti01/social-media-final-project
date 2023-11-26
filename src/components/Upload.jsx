import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FaPlus } from "react-icons/fa";
import { storage, db } from "../config/firebase";
import "../styles/Upload.css";
import { useNavigate } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

function Upload({ user }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [showDelete, setshowDelete] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const Navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
    setFile(URL.createObjectURL(e.target.files[0]));

    var a = e.target.value.toString().split("\\");
    var name = a[a.length - 1];
    if (name.length > 20)
      name =
        name.split(".")[0].substring(0, 20) +
        "...." +
        name.split(".")[name.split(".").length - 1];
    setFileName(name);
    setshowDelete(true);
  };

  const handleTrash = () => {
    setshowDelete(false);
    setImage(null);
    setFileName("");
    setFile(null);
  };

  const closeUpload = () => {
    document.querySelector(".upload").style.display = "none";
    document.querySelector(".filter").style.display = "none";
  };

  const openUpload = () => {
    if (!user) {
      alert("Debes registrarte");
      Navigate("/login");
      return;
    }
    document.querySelector(".upload").style.display = "grid";
    document.querySelector(".filter").style.display = "block";
  };

  const handleUpload = () => {
    const imageName = `${image.name}${
      Math.floor(Math.random() * (9999 - 1000)) + 1000
    }`;
    const storageRef = ref(storage, `images/${imageName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      async () => {
        toast.success("Post created successfully");
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const db2 = collection(db, "posts");
        await addDoc(db2, {
          timestamp: serverTimestamp(),
          avatar:
            user.photoURL ||
            `https://avatars.dicebear.com/api/gridy/${user.email}.svg`,
          caption: caption,
          imageUrl: downloadURL,
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
        });
        setProgress(0);
        setCaption("");
        setImage(null);
        setFileName("");
        setFile(null);
        setshowDelete(false);
        closeUpload();
        document.getElementById("root").scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  return (
    <div className="uploadContainer">
      <ToastContainer position="top-right" reverseOrder={false} />
      <div className="addPostBtn" onClick={openUpload}>
        <FaPlus />
      </div>
      <div className="upload">
        <div className="uploadContent">
          {file && (
            <>
              <div className="postHeader">
                <h3 className="uploadPreview">POST PREVIEW</h3>
              </div>

              <img className="postImage" src={file} alt={fileName} />
            </>
          )}
          <input
            className="uploadCaption"
            type="text"
            placeholder="Enter a caption..."
            onChange={(event) => setCaption(event.target.value)}
            value={caption}
          />
          <div className="uploadButtons">
            <label htmlFor="file-upload" className="customFileUpload">
              <i className="fas fa-file-upload"></i> Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {showDelete && (
              <>
                <div className="fileName">{fileName}</div>
                <div className="trashBtn" onClick={handleTrash}>
                  <FaTrashAlt
                    color="#8e49dc"
                    style={{ width: 30, height: 30 }}
                  />
                </div>
              </>
            )}
          </div>
          <progress
            className="uploadProgress"
            value={progress}
            max="100"
          ></progress>
          <button
            type="submit"
            disabled={!file && !caption}
            onClick={handleUpload}
            className="postButton"
          >
            Post
          </button>
          <div className="closeBtn" onClick={closeUpload}>
            <IoCloseCircle color="#8e49dc" style={{ width: 30, height: 30 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
