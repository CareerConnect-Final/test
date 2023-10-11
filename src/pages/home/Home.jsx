// Add the state and useEffect to your Home component
import { useContext, useState, useEffect } from "react";
import { StateContext } from "../../context/state";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import axios from "axios";
import cookie from "react-cookies";


const Home = () => {
  const user = cookie.load("user");
  const authToken = cookie.load("auth");
  const state = useContext(StateContext);
// useEffect(()=>{
//   // window.location.reload()
// },[])
const [prevUserId, setPrevUserId] = useState(null);

useEffect(() => {
  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .get("https://final-backend-nvf1.onrender.com/home/followers", {
        headers,
      })
      .then((response) => {
        // console.log("data come comeeeeeeee ")
        state.setFollowers(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }

  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .get("https://final-backend-nvf1.onrender.com/home/users", { headers })
      .then((response) => {
        // console.log("hellooo data is here")
        state.setallUsers(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }

  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    // axios
    //   .get("https://final-backend-nvf1.onrender.com/home/homeposts", {
    //     headers,
    //   })
    //   .then((response) => {
    //     setPosts(response.data);
    //   })
    //   .catch((error) => {
    //     setError(error);
    //   });
    // axios
    //   .get("https://final-backend-nvf1.onrender.com/home/posts", {
    //     headers,
    //   })
    //   .then((response) => {
    //     setPosts(response.data);
    //   })
    //   .catch((error) => {
    //     setError(error);
    //   });
    if (user?.role === "user") {
      // If the user's role is "user," hit the "/home/homeposts" route
      axios
        .get("https://final-backend-nvf1.onrender.com/home/homeposts", {
          headers,
        })
        .then((response) => {
          state.setPosts(response.data);
        })
        .catch((error) => {
          state.setError(error);
        });
    } else if (user?.role === "company") {
      // If the user's role is "company," hit the "/home/posts" route
      axios
        .get("https://final-backend-nvf1.onrender.com/home/posts", {
          headers,
        })
        .then((response) => {
          state.setPosts(response.data);
        })
        .catch((error) => {
          state.setError(error);
        });
    }

    axios
      .get(
        "https://final-backend-nvf1.onrender.com/home/received-friend-requests",
        {
          headers,
        }
      )
      .then((response) => {
        state.setFriendRequests(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
    axios
      .get("https://final-backend-nvf1.onrender.com/home/myfriends", {
        headers,
      })
      .then((response) => {
        state.setMyFriends(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }

  // if (authToken === null) {
  //   throw new Error("Authentication token not found.");
  // } else if (authToken != null) {
  //   const headers = {
  //     Authorization: `Bearer ${authToken}`,
  //   };

  //   axios
  //     .get(`https://final-backend-nvf1.onrender.com/home/users/1`, {
  //       headers,
  //     })
  //     .then((response) => {
  //       setUserProfile(response.data);
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     });
  // }

  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .get("https://final-backend-nvf1.onrender.com/home/likes", { headers })
      .then((response) => {
        state.setLikes(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }
  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .get("https://final-backend-nvf1.onrender.com/home/comments", {
        headers,
      })
      .then((response) => {
        state.setComments(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }

  if (authToken === null) {
    throw new Error("Authentication token not found.");
  } else if (authToken != null) {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get("https://final-backend-nvf1.onrender.com/home/reels", {
        headers,
      })
      .then((response) => {
        state.setReels(response.data);
      })
      .catch((error) => {
        state.setError(error);
      });
  }
}, [authToken]);

  return (
    <div className="home" >
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;



  // useEffect(() => {
  //   if (authToken && !pageRefreshed) {
  //     window.location.reload();
  //     setPageRefreshed(true); // Set the flag to true to prevent further reloads
  //   }
  // }, [authToken, pageRefreshed]);

  

  // useEffect(() => {
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
  //         state.setFollowers(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
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
  //         // console.log("hellooo data is here")
  //         state.setallUsers(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
  //       });
  //   }

  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };
  //     // axios
  //     //   .get("https://final-backend-nvf1.onrender.com/home/homeposts", {
  //     //     headers,
  //     //   })
  //     //   .then((response) => {
  //     //     state.setPosts(response.data);
  //     //   })
  //     //   .catch((error) => {
  //     //     state.setError(error);
  //     //   });
  //     // axios
  //     //   .get("https://final-backend-nvf1.onrender.com/home/posts", {
  //     //     headers,
  //     //   })
  //     //   .then((response) => {
  //     //     state.setPosts(response.data);
  //     //   })
  //     //   .catch((error) => {
  //     //     state.setError(error);
  //     //   });
  //     if (user.role === "user") {
  //       // If the user's role is "user," hit the "/home/homeposts" route
  //       axios
  //         .get("https://final-backend-nvf1.onrender.com/home/homeposts", {
  //           headers,
  //         })
  //         .then((response) => {
  //           state.setPosts(response.data);
  //         })
  //         .catch((error) => {
  //           state.setError(error);
  //         });
  //     } else if (user.role === "company") {
  //       // If the user's role is "company," hit the "/home/posts" route
  //       axios
  //         .get("https://final-backend-nvf1.onrender.com/home/posts", {
  //           headers,
  //         })
  //         .then((response) => {
  //           state.setPosts(response.data);
  //         })
  //         .catch((error) => {
  //           state.setError(error);
  //         });
  //     }

  //     axios
  //       .get(
  //         "https://final-backend-nvf1.onrender.com/home/received-friend-requests",
  //         {
  //           headers,
  //         }
  //       )
  //       .then((response) => {
  //         state.setFriendRequests(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
  //       });
  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/myfriends", {
  //         headers,
  //       })
  //       .then((response) => {
  //         state.setMyFriends(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
  //       });
  //   }

  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get(`https://final-backend-nvf1.onrender.com/home/users/1`, {
  //         headers,
  //       })
  //       .then((response) => {
  //         state.setUserProfile(response.data);
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
  //       .get("https://final-backend-nvf1.onrender.com/home/likes", { headers })
  //       .then((response) => {
  //         state.setLikes(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
  //       });
  //   }
  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };
  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/comments", {
  //         headers,
  //       })
  //       .then((response) => {
  //         state.setComments(response.data);
  //       })
  //       .catch((error) => {
  //         state.setError(error);
  //       });
  //   }

  //   if (authToken === null) {
  //     throw new Error("Authentication token not found.");
  //   } else if (authToken != null) {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     axios
  //       .get("https://final-backend-nvf1.onrender.com/home/reels", {
  //         headers,
  //       })
  //       .then((response) => {
  //         state.setReels(response.data);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       });
  //   }
  // }, [authToken]);