import React, { useRef, useState, useEffect, useContext } from "react";
import cookie from "react-cookies";
import { StateContext } from "../../context/state";
import { Link } from "react-router-dom";

import axios from "axios";
import "./reel.scss";
import { AuthContext } from "../../context/auth/authContext";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Reel(props) {
  const user = cookie.load("user");
  const authToken = cookie.load("auth");

  const [isVideoPlaying, setisVideoPlaying] = useState(false);
  const [videoUpload, setVideoUpload] = useState(""); ///

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const vidRef = useRef();

  const onVideoClick = () => {
    if (isVideoPlaying) {
      vidRef.current.pause();
      setisVideoPlaying(false);
    } else {
      vidRef.current.play();
      setisVideoPlaying(true);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const scroll = document.getElementById("video-container");

    if (scroll) {
      scroll.addEventListener("scroll", () => {
        vidRef.current.pause();
      });
    }
  }, []);

  const newReel = useContext(StateContext);
  const handleAdd = () => {
    if(videoUpload !== ""){
      handleClose();
      console.log(videoUpload.name);
    const videoRef = ref(
      storage,
      `${user?.email}/reels/${videoUpload.name + v4()}`
    );
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const obj = {
          user_id: user.id,
          username: user.firstName,
          video: url,
          profilePicture: user.profilePicture,
        };

        console.log("url==>", url);

        axios
          .post("https://final-backend-nvf1.onrender.com/api/v1/reels", obj)
          .then((data) => {
            setVideoUpload("");
            newReel.addReel(data.data);
            console.log("data.daat==>", data.data);
          })
          .catch((error) => {
            console.error("Error creating reel:", error);
          });
      });
    });
    } 
  };

  const handleFileInputChange = (event) => {
    setVideoUpload(event.target.files[0]);
  };

  return (
    <div className="video-cards">
      <Button variant="primary" className="blue-button" onClick={handleShow}>
        +
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>upload video</Form.Label>
              <Form.Control
                type="file"
                placeholder="choose your video"
                autoFocus
                onChange={handleFileInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>


       {/* <div className="user">
              <div className="userInfo">
                  <img
                    src={props.profilePicture}
                    alt=""
                  />
                <Link
                    to={`/profile/${user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{props.username}</span>
                    </Link>
                    </div>
                    </div> */}

      <video
        loop
        onClick={onVideoClick}
        className="video-player"
        ref={vidRef}
        src={props.url}
      />
    </div>
  );
}
