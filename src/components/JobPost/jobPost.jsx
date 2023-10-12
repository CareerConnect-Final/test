import "./jobPost.scss";
import { useState, useContext, useEffect } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import CommentsJob from "../jobComments/CommentsJob";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JobContext } from "../../context/stateJob";
import socketService from "../../socket/socket";
import cookie from "react-cookies";
import JobModal from "../jobModal/jobModal";

const JobPosts = (props) => {
  const user = cookie.load("user");
  const authToken = cookie.load("auth");
  const createdAt = new Date(props.post.createdAt).toLocaleString();

  const state = useContext(JobContext);
  const navigate = useNavigate();
  const [commentOpen, setCommentOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const likesCount = state.likes
    ? state.likes
        .filter((like) => like.job_id === props.post.id)
        .length.toString()
    : "0";
  const commentCount = state.comments.filter(
    (comment) => comment.job_id === props.post.id
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
    console.log(state.likes);
    const userLike = state.likes.find(
      (like) => like.job_id === props.post.id && user?.id === like.user_id
    );

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    if (userLike) {
      const likeId = userLike.id;
      console.log(likeId);
      console.log(userLike.id);
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      axios
        .delete(
          `https://final-backend-nvf1.onrender.com/careerjob/likes/${likeId}`,
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
        job_id: props.post.id,
      };

      axios
        .post(`https://final-backend-nvf1.onrender.com/careerjob/likes`, obj, {
          headers,
        })
        .then((data) => {
          state.addLike(data.data);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  const handleDelete = (id) => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .delete(`https://final-backend-nvf1.onrender.com/careerjob/jobs/${id}`, {
        headers,
      })
      .then(() => {
        state.deletePost(id);
        // console.log('delete job post')
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  /*-------------------------------------------------------------------- */
  const isCompany = user.role == "company";
  const isOwner = props.post.user_id == user.id;
  const [applicants, setApplicants] = useState([]); // State to store applicants
  const [showApplicantsList, setShowApplicantsList] = useState(false);
  const [myCv, setMyCv] = useState("");

  const handleGetCVAndApply = (e) => {
    const userId = user.id;
    console.log("====>>>>", userId);

    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get(`https://final-backend-nvf1.onrender.com/home/cv/${userId}`, {
          headers,
        })
        .then((response) => {
          setMyCv(response.data);
          console.log("====>>>>", userId);
          console.log("cdcdcdcdcdc", response.data);
          console.log("cdcdcdcdcdc", myCv);
          handleApply(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleApply = (cvData) => {
    // Receive cvData as an argument
    const jobId = props.post.id;

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    const userCvData = {
      cv_link: cvData, // Now you have access to cvData
      // Include any other necessary fields from userCv
    };

    axios
      .post(
        `https://final-backend-nvf1.onrender.com/home/applyjob/${jobId}`,
        userCvData,
        {
          headers,
        }
      )
      .then((response) => {
        // Handle the response here, e.g., show a success message
        console.log("Applied successfully:", response.data);
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message
        console.error("Error while applying:", error);
      });

    const sentData = {
      senderId: user.id,
      senderName: user.username,
      profilePicture: user.profilePicture,
      receiverId: props.post.user_id,
      message: `${user.username} has applied to your job post`,
      jobPostId: jobId,
    };
    console.log(sentData);
    socketService.socket.emit("applyJob", sentData);
  };

  const handleShowApplicants = () => {
    const jobId = props.post.id; // The ID of the job for which you want to fetch applicants

    if (isCompany && isOwner) {
      navigate(`/applicants/${jobId}`);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {user ? <img src={props.post.profilePicture} alt="" /> : ""}
            <div className="details">
              <Link
                to={`/profile/${props.post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{props.post.company_name}</span>
              </Link>
              <span className="date">{createdAt}</span>
            </div>
          </div>
          {props.post.user_id === user?.id && (
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

        <div className="content-job">
          <div className="cont-cont">
            <div className="cont-post"> Title : </div>
            <p>{props.post.job_title}</p>
          </div>
          <div className="cont-cont">
            <div className="cont-post"> Field : </div>
            <p>{props.post.job_field}</p>
          </div>
          <div className="cont-cont">
            <div className="cont-post"> City : </div>
            <p>{props.post.job_city}</p>
          </div>
          <div className="cont-cont">
            <div className="cont-post1"> Description : </div>
            <p>{props.post.content}</p>
          </div>

          <img
            src={
              props.post.photo
              // "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
            }
            alt=""
          />
        </div>
        <div className="info">
          <div className="share-pst">
            <div className="item" onClick={handleLikeClick}>
              {state.likes.filter(
                (like) =>
                  like.job_id === props.post.id && user?.id === like.user_id
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
          <div className="aply-btn">
            {!isCompany && !isOwner ? (
              <button onClick={() => handleGetCVAndApply()}>Apply</button>
            ) : null}
          </div>

          <div className="aply-btn">
            {isCompany && isOwner ? (
              <button onClick={() => handleShowApplicants()}>
                Show Applicants
              </button>
            ) : null}
          </div>
        </div>
        {commentOpen && (
          <CommentsJob comments={state.comments} id={props.post.id} />
        )}
        {showModal && (
          <JobModal
            checkJob="jobposts"
            id={props.post.id}
            showFlag={showModal}
            handleclose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default JobPosts;
