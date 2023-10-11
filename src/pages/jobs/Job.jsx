import JobPosts from "../../components/JobPosts/jobPosts";
import Share from "../../components/shareJob/ShareJob";
import JobSearch from "../../components/JobSearch/JobSearch";
import "./job.scss";
import { useEffect, useContext } from "react";
import axios from "axios";
import { JobContext } from "../../context/stateJob";
import cookie from "react-cookies";

const JobPage = () => {
  const user = cookie.load("user");
  const authToken = cookie.load("auth");
  const stateJob = useContext(JobContext);
  useEffect(() => {
    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get("https://final-backend-nvf1.onrender.com/home/friendsreq", {
          headers,
        })
        .then((response) => {
          stateJob.setFriendRequests(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });

      axios
        .get("https://final-backend-nvf1.onrender.com/home/myfriends", {
          headers,
        })
        .then((response) => {
          stateJob.setMyFriends(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }
    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      axios
        .get(
          "https://final-backend-nvf1.onrender.com/careerjob/followdcompanies",
          {
            headers,
          }
        )
        .then((response) => {
          console.log("data come comeeeeeeee ");
          stateJob.setYouFollow(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }

    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get("https://final-backend-nvf1.onrender.com/careerjob/likes", {
          headers,
        })
        .then((response) => {
          stateJob.setLikes(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }
    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get("https://final-backend-nvf1.onrender.com/home/jobcomments", {
          headers,
        })
        .then((response) => {
          stateJob.setComments(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }
    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else if (authToken != null) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get("https://final-backend-nvf1.onrender.com/careerjob/jobs", {
          headers,
        })
        .then((response) => {
          stateJob.setJobPosts(response.data);
          // console.log(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
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
          // console.log("job users from job job ")
          stateJob.setAllUsers(response.data);
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }
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
          stateJob.setFollowers(response.data);
          // console.log(stateJob.followers)
        })
        .catch((error) => {
          stateJob.setError(error);
        });
    }
  }, []);

  return (
    <div className="home">
      {/* <Stories/> */}
      {user?.role === "company" &&
      (<>
            <Share />
            <JobPosts />
        </>
      )
      }
      {user?.role !== "company" &&
            <JobSearch />
      }
    </div>
  );
};

export default JobPage;
