import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";

export const JobContext = React.createContext();

export default function State(props) {
  const [jobPost, setJobPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [jobSearch, setJobSearch] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [youFollow,setYouFollow]=useState([])
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  // const [jobCity, setJobCity] = useState([]);
  // const [jobTitle, setJobTitle] = useState([]);
  const [renderJobs, setRenderJobs] = useState(jobPost);

  const [error, setError] = useState(null);
  const authToken = cookie.load("auth");
  const user = cookie.load("user");

  const acceptFriendRequest = async (receiver_id) => {
    try {
      const response = await axios.post(
        `https://final-backend-nvf1.onrender.com/home/handle-friend-request/${receiver_id}`,
        { action: "accept" },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async (receiver_id) => {
    try {
      const url = `https://final-backend-nvf1.onrender.com/home/handle-friend-request/${receiver_id}`;
      console.log("Declining friend request. URL:", url);

      const response = await axios.post(
        url,
        { action: "decline" },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  // useEffect(() => {
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/friendsreq", {
  //         headers,
  //       })
  //       .then((response) => {
  //         setFriendRequests(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/myfriends", {
  //         headers,
  //       })
  //       .then((response) => {
  //         setMyFriends(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };
  //     axios
  //       .get(
  //         "https://final-backend-nvf1.onrender.com/careerjob/followdcompanies",
  //         {
  //           headers,
  //         }
  //       )
  //       .then((response) => {
  //         // console.log("data come comeeeeeeee ");
  //         setYouFollow(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }

  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/careerjob/likes", {
  //         headers,
  //       })
  //       .then((response) => {
  //         setLikes(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/jobcomments", {
  //         headers,
  //       })
  //       .then((response) => {
  //         setComments(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/careerjob/jobs", {
  //         headers,
  //       })
  //       .then((response) => {
  //         setJobPosts(response.data);
  //         // console.log(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };
  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/users", { headers })
  //       .then((response) => {
  //         // console.log("job users from job job ")
  //         setAllUsers(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };
  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/followers", {
  //         headers,
  //       })
  //       .then((response) => {
  //         // console.log("data come comeeeeeeee ")
  //         setFollowers(response.data);
  //         // console.log(followers)
  //       })
  //       .catch((error) => {
  //        setError(error);
  //       });
  //   }
  // },[] );




  const addPost = (newPost) => {
    setJobPosts([newPost, ...jobPost]);
  };
  const addLike = (newLike) => {
    setLikes([newLike, ...likes]);
  };

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const editPost = (editedPost) => {
    setJobPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === editedPost.id) {
          return editedPost;
        }
        return post;
      });
    });
  };
  const editComments = (editedcomment) => {
    setComments((prevComment) => {
      return prevComment.map((comment) => {
        if (comment.id === editedcomment.id) {
          return editedcomment;
        }
        return comment;
      });
    });
  };
  const resetStateJob = () => {
    setJobPosts([]);
    setComments([]);
    setLikes([]);
    setFriendRequests([]);
    setMyFriends([]);
    setAllUsers([]);
    setFollowers([]);
    setYouFollow([])
    setLoading(true);
    setError(null);
  };
  const deletePost = (id) => {
    let newPosts = jobPost.filter((item) => item.id != id);
    setJobPosts(newPosts);
  };
  const deleteComment = (id) => {
    let newComments = comments.filter((item) => item.id != id);
    setComments(newComments);
  };
  const deleteLike = (id) => {
    let newLikes = likes.filter((item) => item.id != id);
    setLikes(newLikes);
  };
  // console.log(followers)

  const state = {
    jobPost: jobPost.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    setJobPosts:setJobPosts,
    youFollow:youFollow,
    setYouFollow:setYouFollow,
    comments: comments,
    setComments:setComments,
    likes: likes,
    setLikes:setLikes,
    allUsers:allUsers,
    setAllUsers:setAllUsers,
    followers:followers,
    setFollowers:setFollowers,
    addPost: addPost,
    friendRequests:friendRequests,
    setFriendRequests:setFriendRequests,
    deletePost: deletePost,
    editPost: editPost,
    acceptFriendRequest,
    declineFriendRequest,
    myFriends: myFriends,
    setUserData:setUserData,
    setMyFriends:setMyFriends,
    deleteLike: deleteLike,
    deleteComment: deleteComment,
    editComments: editComments,
    addComment: addComment,
    addLike: addLike,
    jobSearch:jobSearch,
    setJobSearch:setJobSearch,
    setError:setError,
    resetStateJob:resetStateJob,
    renderJobs:renderJobs,
    setRenderJobs:setRenderJobs,
    // jobCity:jobCity,
    // setJobCity: setJobCity,
    // jobTitle: jobTitle,
    // setJobTitle: setJobTitle,
  };

  return (
    <JobContext.Provider value={state}>
      {props.children}
    </JobContext.Provider>
  );
}
