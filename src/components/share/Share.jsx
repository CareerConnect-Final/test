import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/authContext";
import  {StateContext}  from "../../context/state";
import { useState ,useRef } from "react";
import axios from "axios";
import cookie from "react-cookies";
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

  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState("");///
  const [photoContent, setPhotoContent] = useState("");///
  const newPost = useContext(StateContext);
  const [postContent, setPostContent] = useState("");
 const user=cookie.load("user")
 const handleAdd = () => {
  // console.log("imageUpload--->", imageUpload)
  const imageRef = ref(storage, `${user?.email}/posts/${imageUpload.name + v4()}`);
  uploadBytes(imageRef, imageUpload).then((snapshot) => {
    getDownloadURL(snapshot.ref).then( (url) => {
      const obj = {
        user_id: user?.id,
        username: user?.username,
        content: postContent,
        photo: url,
        profilePicture: user?.profilePicture,
      };
      axios
        .post("https://final-backend-nvf1.onrender.com/api/v1/posts", obj)
        .then((data) => {
          setPostContent("");
          setPhotoContent("");
          setImageUpload("");
          newPost.addPost(data.data);
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    });
  });
};


const handleImageClick = () => {
  // Trigger the file input when "Add Image" is clicked
  if (fileInputRef.current) {
    fileInputRef.current.click();



  }
};

const handleImageInputChange = (event) => {
  const selectedFile = event.target.files[0];
  setImageUpload(selectedFile);
 
};

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          {user ?<img src={user.profilePicture } alt="" />:""}
          <input
            type="text"
            placeholder={`What's on your mind ${user?.username}?`}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <input //////////////
            type="text"
            value={imageUpload.name}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
          <input
              type="file"
              id="file"
              ref={fileInputRef} // Assign the ref to the file input
              style={{
                display: "none",
              }}
              onChange={handleImageInputChange}
            />
            <div className="item" onClick={handleImageClick}>
              <img src={Image} alt="" />
              <span>Add Image</span>
            </div>

            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleAdd}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Share;