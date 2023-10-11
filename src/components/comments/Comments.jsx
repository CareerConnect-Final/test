import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/auth/authContext";
import { StateContext } from "../../context/state";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import cookie from "react-cookies";
import PostModal from "../postModal/PostModal";
import axios from "axios";
import socketService from "../../socket/socket";
const Comments = (props) => {
  const [showModals, setShowModals] = useState({}); // Use an object to store the showModal state for each comment
  const user = cookie.load("user");
  const newComments = useContext(StateContext);
  const authToken = cookie.load("auth");
  const [newComment, setNewComment] = useState("");
  // console.log(props.id);

  // Maintain a separate state for showing the menu for each comment
  const [showMenus, setShowMenus] = useState(
    Array(props.comments.length).fill(false)
  );

  // const handleShow = () => {
  //   setShowModals({});
  // };

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
      post_id: props.id,
      content: newComment,
    };
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .post("https://final-backend-nvf1.onrender.com/home/comments", obj,{headers})
      .then((data) => {
        setNewComment("");
        console.log("->", props);
        newComments.addComment(data.data);
        const sentData = {
          senderId: user.id,
          senderName: user.username,
          profilePicture: user.profilePicture,
          receiverId: props.postuserId,
          message: `${user.username} commented on your post`,
          postId: props.id,
        };

        socketService.socket.emit("commentPost", sentData);
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
    console.log("Ssssssssssssssssss")
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://final-backend-nvf1.onrender.com/api/v1/comments/${id}`)
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
        if (comment.post_id === props.id) {
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
                <div style={{paddingLeft:"12px"}}>{comment.username} </div>
                </div>
              </div>
              <div className="com-sec">
              <p>{comment.content}</p>
              </div>
            </div>
            {/* <span className="date">1 hour ago</span> */}
            {showModals[comment.id] && (
              <PostModal
              check="comments"
              id={comment.id}
              showFlag={showModals[comment.id]}
              handleclose={() => handleClose(comment.id)} // Pass the correct function
              />
            )}
        
          </div>
            
            
            
            
            // <div className="comment" key={idx}>
            //   <img src={comment.profilePicture} alt="" />
            //   <div className="info">
            //     <div>
            //       {/* {console.log(comment.user_id ,"+++++++",user.id)} */}
            //       {user.id === comment.user_id && (
            //         <div className="menu-container">
            //           <MoreHorizIcon onClick={() => toggleMenu(idx)} />
            //           {showMenus[idx] && (
            //             <div className="menu">
            //               <div
            //                 className="menu-option"
            //                 style={{ color: "blue" }}
            //                 onClick={() =>
            //                   // setShowModals({ [comment.id]: true })
            //                   setShowModals( true )
            //                 } // Open the modal for this specific comment
            //               >
            //                 Edit
            //               </div>
            //               <div
            //                 className="menu-option"
            //                 style={{ color: "red" }}
            //                 onClick={() => handleDelete(comment.id)}
            //               >
            //                 Delete
            //               </div>
            //             </div>
            //           )}
            //         </div>
            //       )}
            //     </div>
            //     <span>{comment.username}</span>
            //     <p>{comment.content}</p>
            //   </div>
            //   <span className="date">1 hour ago</span>
            //   {showModals[comment.id] && (
            //     <PostModal
            //       check="comments"
            //       id={comment.id}
            //       showFlag={showModals[comment.id]}
            //       handleclose={() => handleClose(comment.id)} // Pass the correct function
            //     />
            //   )}
            // </div>
          );
        }
      })}
    </div>
  );
};

export default Comments;
