import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StateContext } from "../../context/state";
import PostModal from "../postModal/PostModal";
import cookie from "react-cookies";
import socketService from "../../socket/socket"; // Import the socket service
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Post = (props) => {
  const navigate = useNavigate();

  // const userID = useParams();
  // console.log(userID.id)

  const user = cookie.load("user");
  const authToken = cookie.load("auth");

  const state = useContext(StateContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const likesCount = state.likes
    ? state.likes
        .filter((like) => like.post_id === props.post.id)
        .length.toString()
    : "0";
  const commentCount = state.comments.filter(
    (comment) => comment.post_id === props.post.id
  ).length;
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleLikeClick = () => {
    const userLike = state.likes.find(
      (like) => like.post_id === props.post.id && user?.id === like.user_id
    );

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    if (userLike) {
      const likeId = userLike.id;

      axios
        .delete(
          `https://final-backend-nvf1.onrender.com/home/likes/${likeId}`,
          {
            headers,
          }
        )
        .then(() => {
          state.deleteLike(likeId);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    } else {
      const obj = {
        post_id: props.post.id,
      };

      axios
        .post(`https://final-backend-nvf1.onrender.com/home/likes`, obj, {
          headers,
        })
        .then((data) => {
          state.addLike(data.data);
          const sentData = {
            senderId: user.id,
            senderName: user.username,
            profilePicture: user.profilePicture,
            receiverId: props.post.user_id,
            message: `${user.username} liked your post`,
            postId: props.post.id,
          };

          socketService.socket.emit("likePost", sentData);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://final-backend-nvf1.onrender.com/api/v1/posts/${id}`)
      .then(() => {
        state.deletePost(id);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  let userProfileId = (id) => {
    state.setUserId(id);
    // console.log(id)
  };

  // console.log(props.post)

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={props.post.profilePicture} alt="" />
            <div className="details">
              <Link
                to={`/profile/${props.post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span
                  onClick={userProfileId(props.post.user_id)}
                  className="name"
                >
                  {props.post.username}
                </span>
              </Link>
              <span className="date">1 min ago</span>
            </div>
          </div>
          {props.post.user_id === user?.id && (
            // {console.log(props.post.user_id ,"+++++++",user.id)}
            <div className="menu-container">
              <MoreHorizIcon onClick={toggleMenu} />
              {showMenu && (
                <div className="menu">
                  <div
                    className="menu-option"
                    style={{ color: "blue" }}
                    onClick={handleShow}
                  >
                    Edit
                  </div>
                  <div
                    className="menu-option"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(props.post.id)}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="content">
          <p>{props.post.content}</p>
          <img
            src={
              props.post.photo
              // "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
            }
            alt=""
          />
        </div>
        <div className="info">
          <div className="item" onClick={handleLikeClick}>
            {state.likes.filter(
              (like) =>
                like.post_id === props.post.id && user?.id === like.user_id
            ).length > 0 ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}

            {likesCount}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentCount}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && (
          <Comments
            comments={state.comments}
            id={props.post.id}
            postuserId={props.post.user_id}
          />
        )}
        {showModal && (
          <PostModal
            check="posts"
            id={props.post.id}
            showFlag={showModal}
            handleclose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
