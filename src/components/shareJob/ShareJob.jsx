import "./shareJob.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/authContext";
import { StateContext } from "../../context/state";
import { JobContext } from "../../context/stateJob";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { DarkModeContext } from "../../context/darkModeContext";
/////////////////////////////////////firebase//
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
///////////////////////////////////
const Share = () => {
  const [imageUpload, setImageUpload] = useState(""); ///
  const [photoContent, setPhotoContent] = useState(""); ///
  const newPost = useContext(JobContext);
  const [postContent, setPostContent] = useState("");
  const [cityContent, setCityContent] = useState("");
  const [fieldContent, setFieldContent] = useState("");
  const [titleContent, setTitleContent] = useState("");

  const { darkMode } = useContext(DarkModeContext);

  const user = cookie.load("user");
  const authToken = cookie.load("auth");

  const handleAdd = () => {
    // console.log("imageUpload--->", imageUpload)
    // const imageRef = ref(storage, `${user.email}/posts/${imageUpload.name + v4()}`);

    // uploadBytes(imageRef, imageUpload).then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then( (url) => {
    const obj = {
      user_id: user?.id,
      company_name: user?.firstName,
      job_title: titleContent,
      job_city: cityContent,
      job_field: fieldContent,
      content: postContent,
      // photo: "url",
      profilePicture: user?.profilePicture,
    };
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .post("https://final-backend-nvf1.onrender.com/careerjob/jobs", obj, {
        headers,
      })
      .then((data) => {
        setPostContent("");
        setCityContent("");
        setFieldContent("");
        setTitleContent("");

        newPost.addPost(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
    // });
    // });
  };
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setPostContent((prevContent) => prevContent + "\n");
    }
  };

  const { currentUser } = useContext(AuthContext);
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="top-img">
            <img src={user?.profilePicture} alt="" />
          </div>
          <div className="top-inpt">
            {darkMode ? (
              <textarea
                style={{ backgroundColor: "#222222", color: "white" }}
                placeholder={`Add a job post`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                cols={50}
              />
            ) : (
              <textarea
                placeholder={`Add a job post`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                cols={50}
              />
            )}
            <input
              type="text"
              placeholder={`Add city`}
              value={cityContent}
              onChange={(e) => setCityContent(e.target.value)}
            />
            <input
              type="text"
              placeholder={`Add title`}
              value={titleContent}
              onChange={(e) => setTitleContent(e.target.value)}
            />
            <input
              type="text"
              placeholder={`Add field`}
              value={fieldContent}
              onChange={(e) => setFieldContent(e.target.value)}
            />
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left"></div>
          <div className="right">
            <button onClick={handleAdd}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
