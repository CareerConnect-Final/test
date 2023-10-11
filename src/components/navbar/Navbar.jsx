import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/auth/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import {
  Visibility as VisibilityIcon, // Add this line
  Delete as DeleteIcon, // Add this line
} from "@mui/icons-material";
import socketService from "../../socket/socket";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemAvatar,
  Avatar,
  Slide,
  Paper,
  IconButton,
  ListItemSecondaryAction,
  Divider,
  Button,
} from "@mui/material";

import cookie from "react-cookies";
import "./navbar.scss";
import { StateContext } from "../../context/state";
import { JobContext } from "../../context/stateJob";

const Navbar = () => {
  const user= cookie.load("user")
  const state = useContext(StateContext);
  const stateJob = useContext(JobContext);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [userNames, setUserNames] = useState([]);
  const navigate = useNavigate();
  const authToken = cookie.load("auth");
  const handleSignOut = async () => {
    try {
      stateJob.resetStateJob();
      state.resetState();

      await logout();

        navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /*-------------------------------------------------------------------------------------------------*/

  /*-------------------------------------------------------------------------------------------------*/
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [seenNotifications, setSeenNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [showSeenNotifications, setShowSeenNotifications] = useState(false);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

  useEffect(() => {
    const fetchExistingNotifications = async () => {
      try {
        // Include the authorization header with the bearer token
        const response = await axios.get(
          "https://final-backend-nvf1.onrender.com/home/usernotification",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Replace authToken with your actual token
            },
          }
        );
        const prevnotifications = response.data.map((notification) => ({
          ...notification,
          seen: notification.is_seen,
        }));
        setNotifications(prevnotifications);
      } catch (error) {
        console.error("Error fetching existing notifications:", error);
      }
    };

    fetchExistingNotifications();
  }, []); // Empty dependency array means this effect runs once when the component mounts
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    // Split notifications into seen and unseen
    const seen = [];
    const unseen = [];
    notifications.forEach((notification) => {
      if (notification.is_seen) {
        seen.push(notification);
      } else {
        unseen.push(notification);
      }
    });
    setSeenNotifications(seen);
    setUnseenNotifications(unseen);
  }, [notifications]);

  const clearAllNotifications = async () => {
    try {
      // Send a request to your backend to delete all notifications
      await axios.delete(
        "https://final-backend-nvf1.onrender.com/home/notifications",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Clear notifications in the client
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };
  const deleteSingleNotification = async (notificationId) => {
    try {
      // Send a request to your backend to delete a single notification
      await axios.delete(
        `https://final-backend-nvf1.onrender.com/home/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Clear the deleted notification in the client
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting a notification:", error);
    }
  };

  const markNotificationAsSeen = async (notificationId) => {
    try {
      // Send a request to your backend to mark a notification as seen
      const res = await axios.put(
        `https://final-backend-nvf1.onrender.com/home/notifications/${notificationId}/seen`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Update the client to mark the notification as seen
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          if (notification.id === notificationId) {
            notification.seen = true; // Update 'seen' property
          }
          return notification;
        })
      );
    } catch (error) {
      console.error("Error marking a notification as seen:", error);
    }
  };

  useEffect(() => {
    if (socketService.socket) {
      socketService.onConnect(() => {
        socketService.socket.on("newNotification", (notification) => {
          console.log("New notification:", notification);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
          if (!notification.seen) {
            setUnseenNotificationCount((count) => count + 1);
          }
        });
      });
    }

    return () => {
      if (socketService.socket) {
        socketService.removeEventListener("newNotification", (notification) => {
          console.log("New notification:", notification);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
          if (!notification.seen) {
            setUnseenNotificationCount((count) => count + 1);
          }
        });
      }
    };
  }, []);

  const handleSearch = async () => {
    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else {
      try {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };

        const response = await axios.get(
          `https://final-backend-nvf1.onrender.com/home/users`,
          {
            headers,
          }
        );

        setUserNames(response.data);
        state.setLoading(false);
      } catch (error) {
        console.error("Error searching users:", error);
      }
      //   // setUsers(response.data);
      //   // users.map((user) => console.log(user.username));
      // } catch (error) {
      //   console.error("Error searching users:", error);
      // }
    }
  };
  const openNotifications = () => {
    setIsNotificationsOpen(true);
  };

  // Function to close the notifications dialog
  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  return (
    <>
      {" "}
      <div className="navbar">
        <div className="left">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span>CareerConnect</span>
          </Link>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <HomeOutlinedIcon />
          </Link>
          {darkMode ? (
            <WbSunnyOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}
          <Link to="/job" style={{ textDecoration: "none", color: "inherit" }}>
            <WorkOutlineIcon />{" "}
          </Link>
          <div className="search" onClick={handleSearch}>
            <SearchOutlinedIcon />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleChange}
            />
            {/* {console.log(search)} */}
            {search && (
              <div className="search-results">
                {userNames
                  .filter((user) =>
                    user.username.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <ul key={user.id} className="list-group">
                      <Link className="search-profile"
                        to={`/profile/${user.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                      <img  
                        src={user.profilePicture}
                        // alt={`Profile Picture of ${user.username}`}
                        className="user-photo"
                      />
                        
                        <li className="search-result">
                          {user.username}
                        </li>{" "}
                      </Link>

        
                    </ul>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <PersonOutlinedIcon />
          <Link
            to="/chats"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <EmailOutlinedIcon />
          </Link>
          <NotificationsOutlinedIcon onClick={openNotifications}>
            {unseenNotificationCount > 0 && (
              <span className="unseen-notification-count">
                {unseenNotificationCount}
              </span>
            )}{" "}
          </NotificationsOutlinedIcon>
          <div className="user">
            <img src={currentUser?.profilePicture} alt="" />
            <span>{currentUser?.name}</span>
          </div>
          <button className="sign-out" onClick={handleSignOut}>
            Sign Out
          </button>{" "}
        </div>

        <Drawer
          anchor="right"
          open={isNotificationsOpen}
          onClose={closeNotifications}
        >
          <div
            style={{
              width: "355px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              marginTop: "25px"
              
            }}
          >
            <h2>Notifications</h2>
            <Button
              variant="outlined"
              onClick={() => setShowSeenNotifications(!showSeenNotifications)}
            >
              {showSeenNotifications
                ? "Show Unseen Notifications"
                : "Show Seen Notifications"}
            </Button>
            {/* <List>
              {notifications
                .filter((notification) =>
                  showSeenNotifications ? notification.seen : !notification.seen
                )
                .map((notification, index) => (
                  <ListItem key={index} style={{ marginBottom: "10px",
                  paddingRight: "80px" }}>
                    <Link to={`/post/${notification.post_id}`}>
                      <ListItemAvatar>
                        <Avatar
                          alt={notification.senderName}
                          src={notification.profilePicture}
                        />
                      </ListItemAvatar>
                    </Link>

                    <ListItemText
                      // primary={notification.username}
                      secondary={notification.message}
                    />

                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          deleteSingleNotification(notification.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="mark-as-seen"
                        onClick={() => markNotificationAsSeen(notification.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List> */}
            <List>
              {notifications
                .filter((notification) =>
                  showSeenNotifications ? notification.seen : !notification.seen
                )
                .map((notification, index) => (
                  <ListItem key={index} style={{marginBottom: "10px",
                  paddingRight: "80px" }}>
                    {/* Conditionally render a link based on the action_type */}
                    {notification.action_type === "post" ? (
                      <Link to={`/post/${notification.post_id}`}>
                        <ListItemAvatar>
                          <Avatar
                            alt={notification.senderName}
                            src={notification.profilePicture}
                          />
                        </ListItemAvatar>
                      </Link>
                    ) : (
                      <Link
                        to={`/applicant/${notification.post_id}/${notification.sender_id}`}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={notification.senderName}
                            src={notification.profilePicture}
                          />
                        </ListItemAvatar>
                      </Link>
                    )}

                    <ListItemText
                      // primary={notification.username}
                      secondary={notification.message}
                    />

                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          deleteSingleNotification(notification.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="mark-as-seen"
                        onClick={() => markNotificationAsSeen(notification.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
            <div style={{ textAlign: "center" }}>
              <Button onClick={clearAllNotifications}>Clear All</Button>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
