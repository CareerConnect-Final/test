import React, { useState, useEffect } from "react";
import "./rightBar.scss";
import { AuthContext } from "../../context/auth/authContext";
import { StateContext } from "../../context/state";
import { JobContext } from "../../context/stateJob";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { RollerShades } from "@mui/icons-material";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const RightBar = () => {
  const { userId } = useParams();
  const userToken = cookie.load("user");
  const authToken = cookie.load("auth");
  const location = useLocation().pathname.slice(1);
  const [pageType, setPageType] = useState(location);

  // {console.log(pageType)}
  const [send, setSend] = useState({});
  const state = useContext(StateContext);
  const stateJob = useContext(JobContext);
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  const handleSendFriendRequest = (userId) => {
    const obj = {
      sender_id: userToken?.id,
      username: userToken?.username,
      profilePicture: userToken?.profilePicture,
      receiver_id: userId,
      message: `${userToken?.username} sent you a friend request`,
    };
    axios
      .post(
        `https://final-backend-nvf1.onrender.com/home/send-friend-request/${userId}`,
        obj,
        {
          headers,
        }
      )
      .then((data) => {
        console.log(data.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });

    setSend((prevRequests) => ({
      ...prevRequests,
      [userId]: !prevRequests[userId],
    }));
  };
  const handleSendFollow = (userId) => {
    const obj = {};

    const isFollowing = send[userId];
    const endpoint = isFollowing
    ? `https://final-backend-nvf1.onrender.com/home/unfollow/${userId}`
    : `https://final-backend-nvf1.onrender.com/home/makefollow/${userId}`;

    axios
      .post(
        endpoint,
        obj,{headers,})
      .then((data) => {
        console.log(data.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });

    setSend((prevRequests) => ({
      ...prevRequests,
      [userId]: !prevRequests[userId],
    }));
  };
  const handleUnfollow = (companyId) => {
    const encodedCompanyId = encodeURIComponent(companyId);
    const endpoint = `https://final-backend-nvf1.onrender.com/home/unfollow/${encodedCompanyId}`;
  
    axios
      .delete(endpoint, { headers })
      .then((data) => {
        console.log(data.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  
    setSend((prevRequests) => ({
      ...prevRequests,
      [companyId]: false, 
    }));
  };
  
  
  
  const { friendRequests, acceptFriendRequest, declineFriendRequest } =
    useContext(StateContext);
  return (
    <>
      {pageType === "job" && userToken?.role === "company" && (
        <div className="rightBar">
          <div className="container">
            <div id="careerItem">
            <div  className="item">
              <span>People with same career</span>
              {stateJob.allUsers.map((user) => {
                if (
                  user.career === userToken.career && user.role == "user"
                ) {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img
                          src={user?.profilePicture}
                          alt=""
                        />
                      <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            </div>
            <div className="item">
              <span>Followers</span>
              {stateJob.followers.map((user) => {
                {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
      {pageType === "job" && userToken?.role === "user" && (
        <div className="rightBar">
          <div className="container">
            <div className="item">
              <span>Related Companies</span>
              {stateJob.allUsers.map((user) => {
                if (
                  user.career === userToken.career &&
                  user.role == "company" &&
                  !stateJob.youFollow.find(
                    (follower) => follower.receiver_id === user.id
                  )
                ) {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                      <div className="buttons2">
                        {send[user.id] ? (
                          <button
                            id="send"
                            onClick={() => handleSendFollow(user.id)}
                          >
                            Followed
                          </button>
                        ) : (
                          <button
                            id="pending"
                            onClick={() => handleSendFollow(user.id)}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            {pageType === "job" && userToken.role === "user" && (
  <div className="rightBar">
    <div className="container">
            <div className="item">
              <span>Compnies You Follow</span>
              {stateJob.allUsers.map((user) => {
                if (
                  user.role == "company" &&
                  stateJob.youFollow.find(
                    (follower) => follower.receiver_id === user.id
                  )
                ) {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>  
                      <div className="buttons2">
                  <button
                    id="unfollow"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </button>
                </div> 
                    </div>
                  );
                }
              })}
            </div>
            </div>
        </div>
      )}
          </div>
        </div>
      )}
  
      {pageType === "" && userToken?.role === "user" && (
        <div className="rightBar">
          <div className="container">
            <div className="item">
              <span>Friends requests</span>
              {console.log(friendRequests)}
              {friendRequests.map((request) =>       
                request.status === "pending" &&
                userToken?.id !== request.sender_id ? (
                  <div key={request.id} className="user">
                    <div className="userInfo">
                      <img src={request.profilePicture} alt="" />
                      <Link
                        to={`/profile/${request.sender_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>{request.username}</span>
                      </Link>
                    </div>
                    <div className="buttons">
                      <button
                        onClick={() => acceptFriendRequest(request.sender_id)}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineFriendRequest(request.sender_id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <div className="item">
              <span>Suggested Friends</span>
              {state.allUsers.map((user) => {
                if (
                  user.role === "user" &&
                  userToken?.id !== user.id &&
                  !state.myFriends.find((friend) => friend.id === user.id)
                ) {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                      <div className="buttons2">
                        {send[user.id] ? (
                          <button
                            id="send"
                            onClick={() => handleSendFriendRequest(user.id)}
                          >
                            Pending
                          </button>
                        ) : (
                          <button
                            id="pending"
                            onClick={() => handleSendFriendRequest(user.id)}
                          >
                            Send Request
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
                return null; // Exclude users who are already friends
              })}
            </div>

            {/* {send[user.id] ? "Pending" : "Add Friend"} */}
          </div>
        </div>
      )}
      {pageType === "" && userToken?.role === "company" && (
        <div className="rightBar">
          <div className="container">
            <div className="item">
              <span>People with same career</span>
              {state.allUsers.map((user) => {
                if (user.career === userToken.career && user.role == "user") {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            <div className="item">
              <span>Followers</span>
              {state.followers.map((user) => {             
                {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img src={user.profilePicture} alt="" />
                        <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
                return null; // Exclude users who are already friends
              })}
            </div>
         </div>
        </div>
      )}
      {/* {console.log(userId)} */}
      {/* {pageType === `profile/${userId}` &&(
        <div className="rightBar">
          <div className="container">
            <div className="item">
              <span>People with same career</span>
              {stateJob.allUsers.map((user) => {
                if (
                  user.career === "web developer" &&
                  userToken.career === "web developer" &&
                  user.role == "user"
                ) {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img
                          src={user.profilePicture}
                          alt=""
                        />
                           <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
        
                    </div>
                  );
                }
              })}
            </div>
            <div className="item">
              <span>Followers</span>
              {stateJob.followers.map((user) => {
                //  if (
                //    user.role === "user" && userToken.id!==user.id&&
                //    !state.myFriends.find((friend) => friend.id === user.id)
                //  )
                {
                  return (
                    <div key={user.id} className="user">
                      <div className="userInfo">
                        <img
                          src={user.profilePicture}
                          alt=""
                        />
                             <Link
                          to={`/profile/${user.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>{user.username}</span>
                        </Link>
                      </div>
        
                    </div>
                  );
                }
                // return null; // Exclude users who are already friends
              })}
            
            </div>

   
          </div>
        </div>
      )} */}

      {/* {pageType === `profile/${userId}` && (
  <div className="rightBar">
    <div className="container">
      <div className="item">
        <span>People with the same career</span>
        {stateJob.allUsers.map((user) => {
          if (
            user.career === "web developer" &&
            userToken.career === "web developer" &&
            user.role == "user"
          ) {
            return (
              <div key={user.id} className="user">
                <div className="userInfo">
                  <img
                    src={user.profilePicture}
                    alt=""
                  />
                  <Link
                    to={`/profile/${user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{user.username}</span>
                  </Link>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="item">
        <span>Followers</span>
        {stateJob.followers && stateJob.followers.map((user) => {
          // Your mapping logic here
        })}
      </div>
    </div>
  </div>
)} */}
    </>
  );
};

export default RightBar;
