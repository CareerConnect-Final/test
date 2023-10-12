import { useContext, useEffect, useState } from "react";
import "./profile.scss";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StateContext } from "../../context/state";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import Posts from "../../components/posts/Posts";
import Post from "../../components/post/Post";
import axios from "axios";
import cookie from "react-cookies";
import { useParams } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { ref, uploadBytes, getDownloadURL, listAll, list, } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";


const Profile = () => {

  const navigate = useNavigate();
  function navigateTo(){
    navigate("/cv")
  }
  const [resumeUpload, setResumeUpload] = useState("");
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myCv, setMyCv] = useState("");
  const { userId } = useParams();
  const authToken = cookie.load("auth");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const state = useContext(StateContext);

  const cookieToken = cookie.load("auth");
  const cookieUser = cookie.load("user"); 
  const token = cookieToken;
  const user = cookieUser;

  const [isFriend, setIsFriend] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendRequestPending, setFriendRequestPending] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState(''); 
  const [userFollowers, setUserFollowers] = useState([]);
  const [isCompanyFollowing, setIsCompanyFollowing] = useState(false);

  const [send, setSend] = useState({});
  const { friendRequests, acceptFriendRequest, declineFriendRequest } =
    useContext(StateContext);
    const userProfile = state.userProfile; 

    useEffect(() => {
      const storedFriendRequestStatus = localStorage.getItem('friendRequestStatus');
      if (storedFriendRequestStatus) {
        setFriendRequestStatus(storedFriendRequestStatus);
      }
    }, []);
  
    localStorage.setItem('friendRequestStatus', 'pending');

//-------------------------------------------------------------------------
const isOwnProfile = user.id === parseInt(userId, 10);

useEffect(() => {
  const fetchUserFollowers = async () => {
    try {
      const response = await axios.get('https://final-backend-nvf1.onrender.com/careerjob/followdcompanies', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUserFollowers(response.data);
      const isFollowingCompany = response.data.some(company => company.receiver_id === state.userProfile.id);
      setIsCompanyFollowing(isFollowingCompany);
    } catch (error) {
      console.error('Error fetching user followers:', error);
    }
  };

  fetchUserFollowers();
}, [authToken, state.userProfile.id]);

const receiver_id = userId

const handleFollow = () => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const endpoint = `https://final-backend-nvf1.onrender.com/home/makefollow/${receiver_id}`;

  axios
    .post(endpoint, {}, { headers })
    .then((data) => {
      console.log('Follow success:', data.data);
      setUserFollowers((prevFollowers) => [...prevFollowers, state.userProfile]);
      setIsCompanyFollowing(true);
      setIsFollowing(true); 
    })
    .catch((error) => {
      console.error('Error', error);
    });
};

const handleUnfollow = () => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const endpoint = `https://final-backend-nvf1.onrender.com/home/unfollow/${receiver_id}`;

  axios
    .delete(endpoint, { headers })
    .then((data) => {
      console.log('Unfollow success:', data.data);
      console.log(data.data);
      setUserFollowers((prevFollowers) =>
        prevFollowers.filter((company) => company.id !== state.userProfile.id)
      );
      setIsCompanyFollowing(false);
      setIsFollowing(false); 
    })
    .catch((error) => {
      console.error('Error during unfollow:', error);
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
    });
    
};

//--------------------------------------------------- ADD FRIEND AND FRIENS---------------------------------------------------  

useEffect(() => {
  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(
        "https://final-backend-nvf1.onrender.com/home/myfriends",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const friendsList = response.data;
      const isUserFriend = friendsList.some(
        (friend) => friend.id.toString() === userId
      );
      setIsFriend(isUserFriend);
      const pendingRequest = friendRequests.find(
        (request) => request.receiver_id === parseInt(userId, 10)
      );
      if (pendingRequest) {
        setFriendRequestStatus('pending');
      } else {
        setFriendRequestStatus('Add Friend');
        localStorage.setItem('friendRequestStatus', 'Add Friend');
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };
  fetchFriendsList();
}, [userId, authToken, friendRequests]);


    //-----------------------------------------------
    const handleFriendAction = () => {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      const friendActionEndpoint = isFriend
        ? `https://final-backend-nvf1.onrender.com/home/unfriend/${userId}`
        : `https://final-backend-nvf1.onrender.com/home/send-friend-request/${userId}`;
      const requestMethod = isFriend ? 'delete' : 'post';
      const confirmation = window.confirm(
        isFriend
          ? 'Are you sure you want to unfriend this user?'
          : 'Send friend request to this user?'
      );
      if (confirmation) {
        axios({
          method: requestMethod,
          url: friendActionEndpoint,
          headers: headers,
        })
          .then((data) => {
            console.log('Friend Action Success:', data.data);
            if (isFriend) {
              setIsFriend(false);
              setFriendRequestStatus('');
            } else {
              console.log('Friend request sent successfully.');
              setFriendRequestStatus('pending');
            }
          })
          .catch((error) => {
            console.error('Error during friend action:', error.response);
            if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
              console.error('Response headers:', error.response.headers);
              if (error.response.status === 400) {
                console.log('Friend request already sent or pending.');
                setFriendRequestStatus('pending');
              }
            }
          })
          .finally(() => {
            localStorage.setItem('friendRequestStatus', friendRequestStatus);
          });
      }
    };
    
  //----------------------------------------------------------------------------------------------

  const handleAdd = () => {
    if (resumeUpload !== "") {
      handleClose();

      if (authToken === null) {
        throw new Error("Authentication token not found.");
      } else if (authToken != null) {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };

        const resumeRef = ref(storage, `cvrrr/${resumeUpload.name + v4()}`);
        uploadBytes(resumeRef, resumeUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            const obj = {
              user_id: user.id,
              full_name: user.username,
              cv_link: url,
            };
            console.log("ccdcdcdcsdcdscllllllllD", obj.cv_link);

            axios
              .post("https://final-backend-nvf1.onrender.com/home/cv", obj, {
                headers,
              })
              .then((data) => {
              })
              .catch((error) => {
                console.error("Error creating post:", error);
              });
          });
        });
      }
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleFileInputChange = (event) => {
    setResumeUpload(event.target.files[0]);
  };

  const handleShowCv = (e) => {
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

          if (response.data) {
            const newWindow = window.open(
              response.data,
              "_blank",
              "noopener,noreferrer"
            );
            if (newWindow) {
              newWindow.opener = null; // Prevent the new window from having access to the opener window.
            }
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const [isLoading, setIsLoading] = useState(true); // Initialize with true

  useEffect(() => {
    if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get(
          `https://final-backend-nvf1.onrender.com/home/userposts/${userId}`,
          {
            headers,
          }
        )
        .then((response) => {
          state.setUsersPosts(response.data);
          setIsLoading(false); // Set isLoading to false when data is fetched
        })
        .catch((error) => {
          state.setError(error);
          setIsLoading(false); // Handle errors and still set isLoading to false
        });
    }
  }, []);

   useEffect(() => {
    if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get(`https://final-backend-nvf1.onrender.com/home/users/${userId}`, {
          headers,
        })
        .then((response) => {
          state.setUserProfile(response.data);
        })
        .catch((error) => {
          state.setError(error);
        });
    }
  }, []);
  return (
    <div className="profile">
      <div className="images">
        <img
          src={state.userProfile.imageForCover || null}
          alt=""
          className="cover"
        />
        <img
          src={state.userProfile.profilePicture || null}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="top">
            {user?.id == state.userProfile.id ? (
              <MoreVertIcon onClick={openModal} />
            ) : null}
          </div>
          <div className="sub-top">
            <div>
              {!isOwnProfile && (
                <button
                onClick={() => {
                  if (userProfile?.role === 'company') {
                    isCompanyFollowing ? handleUnfollow() : handleFollow();
                  } else {
                    handleFriendAction();
                  }
                }}
                >
                {userProfile?.role === 'company' &&
                  (isCompanyFollowing ? 'Unfollow' : 'Follow')}
                {userProfile?.role !== 'company' && 
                  (isFriend
                    ? 'Friends'
                    : friendRequestStatus === 'pending'
                    ? 'Pending'
                    : 'Add Friend')}
                </button>

                  )}
            </div>
          <div className="sub-top-top">
            <div>
            <div>
              {user?.id != userId && user?.role === "company" ? (
                <button className="resume" onClick={navigateTo}>
                  create cv
                </button>
              ) : null}

              {user?.id == userId && user?.role !== "company" ? (
                <button className="resume" onClick={navigateTo}>
                  create cv
                </button>
              ) : null}
            </div>
            </div>
           {/* <button onClick={navigateTo}>create CV</button> */}
            
            
            {user?.id == userId && user?.role !== "company" ? (
              <button
              variant="primary"
              className="resume1"
              onClick={handleShow}
              >
                Add Cv
              </button>
            ) : null}
            </div>
          </div>
          <div className="user-career">
            <div>
              <span>
                {state.userProfile?.firstName} {state.userProfile?.lastName}
              </span>
            </div>
            <div>{state.userProfile.career}</div>
          </div>


          <div className="bio">
            <div>{state.userProfile.city}</div>
          </div>
          <div className="contact-info">
            <div className="con-info">Contact Info:</div>
            <div className="contact-icons">
              <div>
                <AlternateEmailOutlinedIcon /> {state.userProfile?.email}
              </div>
              <div>
                <PermContactCalendarIcon />
                {state.userProfile.phoneNumber}
              </div>
            </div>
          </div>
        </div>
        <div className="uInfo-bio">
          <div>
            <div>About : </div>
            <div>
              {user?.id != userId && user?.role === "company" ? (
                <button className="resume" onClick={handleShowCv}>
                  Resume
                </button>
              ) : null}

              {user?.id == userId && user?.role !== "company" ? (
                <button className="resume" onClick={handleShowCv}>
                  Resume
                </button>
              ) : null}
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>upload Resume</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="choose your Resume"
                      autoFocus
                      onChange={handleFileInputChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleAdd}>
                  Share
                </Button>
              </Modal.Footer>
            </Modal>{" "}
          </div>
          <div>{state.userProfile?.bio}</div>
        </div>
        {isModalOpen && (
          <ProfileModal isOpen={isModalOpen} closeModal={closeModal} />
        )}
        {state.usersPosts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default Profile;





