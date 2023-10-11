import axios from "axios";
import { useContext } from "react";
import "./shareReel.scss";
import { AuthContext } from "../../context/auth/authContext";
import { StateContext } from "../../context/state";
import { useState } from "react";
import cookie from "react-cookies";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

const ShareReels = () => {
  const { currentUser } = useContext(AuthContext);
  const [videoUpload, setVideoUpload] = useState(""); ///
  const [videoContent, setVideoContent] = useState(""); ///
  const [playing, setPlaying] = useState(false); ///

  const newReel = useContext(StateContext);
  const user = cookie.load("user");


  const handleAdd = () => {
    const videoRef = ref(
      storage,
      `${user.email}/reels/${videoUpload.name + v4()}`
    );
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const obj = {
          user_id: user.id,
          username: user.firstName,
          video: url,
          profilePicture: user.profilePicture,
        };

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
  };


  const handleFileInputChange = (event) => {
    setVideoUpload(event.target.files[0]);
  };

  return (
    <div>
      <div className="share-reel">
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <label htmlFor="file">
        <button>+</button>
      </label>
      {videoUpload && <p>Selected file: {videoUpload.name}</p>}
      </div>
      <label htmlFor="file">
        <div className="item">
          {/* <img src={user.profilePicture} alt="" /> */}
          <button onClick={handleAdd}>share</button>
          {/* <span>Add Story</span> */}
        </div>
      </label>
      {
        // videoUpload !== "" ? <button onClick={handleAdd}>+</button> : ""
      }
    </div>
  );
};

export default ShareReels;
