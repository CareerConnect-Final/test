

import { useContext, useState } from "react";
import "./commentsjob.scss";
import { AuthContext } from "../../context/auth/authContext";
import { JobContext } from "../../context/stateJob";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import cookie from "react-cookies";
import PostModal from "../postModal/PostModal";
import axios from "axios";

const CommentsJob = (props) => {
  const [showModals, setShowModals] = useState({}); // Use an object to store the showModal state for each comment
  const user = cookie.load("user");
  const newComments = useContext(JobContext);

  const [newComment, setNewComment] = useState("");
  console.log(props.id);

  // Maintain a separate state for showing the menu for each comment
  const [showMenus, setShowMenus] = useState(Array(props.comments.length).fill(false));

  // const handleShow = () => {
  //   setShowModals({});
  // };
  const authToken = cookie.load("auth");
  const handleClose = (commentId) => {
    setShowModals((prevModals) => ({
      ...prevModals,
      [commentId]: false,
    }));
  };

  const addNewComment = () => {
    console.log("HELLO");
    const obj = {
      profilePicture: user.profilePicture,
      user_id: user.id,
      job_id: props.id,
      content: newComment,
    };
  
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .post("https://final-backend-nvf1.onrender.com/careerjob/jobcomments", obj,{headers})
      .then((data) => {
        setNewComment("");

        newComments.addComment(data.data);
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });

  };


  const toggleMenu = (idx) => {
    // Create a copy of the showMenus array and toggle the menu for the specific comment
    const updatedShowMenus = [...showMenus];
    updatedShowMenus[idx] = !updatedShowMenus[idx];
    setShowMenus(updatedShowMenus);
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://final-backend-nvf1.onrender.com/api/v1/jobcomments/${id}`)
      .then(() => {
        newComments.deleteComment(id);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={user.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={addNewComment}>Send</button>
      </div>
      {props.comments.map((comment, idx) => {
        if (comment.job_id === props.id) {
          return (
            <div className="comment" key={idx}>
              <div className="info1">
                <div className="com-sec1">
              <div className="com-user-img">
              <img src={comment.profilePicture} alt="" />
                  {user.id === comment.user_id && (
                    <div className="menu-container">
                      <div className="com-dots"><MoreHorizIcon onClick={() => toggleMenu(idx)} /></div>
                      {showMenus[idx] && (
                        <div className="menu">
                          <div
                            className="menu-option"
                            style={{ color: "blue" }}
                            onClick={() => setShowModals({ [comment.id]: true })} // Open the modal for this specific comment
                          >
                            Edit
                          </div>
                          <div
                            className="menu-option"
                            style={{ color: "red" }}
                            onClick={() => handleDelete(comment.id)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                <div style={{paddingLeft:"12px"}}>{comment.username}</div>
                  </div>
                </div>
                <div className="com-sec">
                <p>{comment.content}</p>
                </div>
              </div>
              {/* <span className="date">1 hour ago</span> */}
              {showModals[comment.id] && (
                <PostModal
                checkJob="jobcomments"
                id={comment.id}
                showFlag={showModals[comment.id]}
                handleclose={() => handleClose(comment.id)} // Pass the correct function
                />
              )}
          
            </div>
          );
        }
      })}
    </div>
  );
};

export default CommentsJob;
