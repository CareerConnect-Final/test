import "./jobsearch.scss";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth/authContext";
import { JobContext } from "../../context/stateJob";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import JobPost from "../JobPost/jobPost";
import { DarkModeContext } from "../../context/darkModeContext";
/////////////////////////////////////firebase//
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
///////////////////////////////////
const JobSearch = () => {
  const filter = useContext(JobContext);
  const [renderJobs, setRenderJobs] = useState(filter.jobPost);
  const [flag, setFlag] = useState(false)
  // setRenderJobs(filter.jobPost);
  
  const { darkMode } = useContext(DarkModeContext);

  const [searchBasedOn, setSearchBasedOn] = useState("Title"); 
  const [selectedTitle, setSelectedTitle] = useState(""); 
  const [selectedCity, setSelectedCity] = useState(""); 
  

  const user = cookie.load("user");
  const authToken = cookie.load("auth");

  const handleSearch = () => {
    if(selectedTitle !== "" && selectedCity == ""){
      if (authToken === null) {
        throw new Error("Authentication token not found.");
      } else if (authToken != null) {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };

        axios
          .get(`https://final-backend-nvf1.onrender.com/careerjob/jobtitle/${selectedTitle}`, { headers })
          .then((response) => {
            console.log("tttttttitle",response.data)

            // filter.setJobSearch(response.data);
            setRenderJobs(response.data);
            setFlag(true)
          })
          .catch((error) => {
            setError(error);
          });
        
      }

    } else if (selectedTitle == "" && selectedCity !== ""){
      if (authToken === null) {
        throw new Error("Authentication token not found.");
      } else if (authToken != null) {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };
        axios
          .get(`https://final-backend-nvf1.onrender.com/careerjob/jobcity/${selectedCity}`, { headers })
          .then((response) => {
            // filter.setJobSearch(response.data);
            setRenderJobs(response.data);
            setFlag(true)
            console.log("=============>>>>", response.data)
          })
          .catch((error) => {
            setError(error);
          });
      }
    }

      
  };

  const handelFlag = (e) => {
    setFlag(false);
    setSelectedCity("");
    setSelectedTitle("");
  }

  const handleSearchBasedOn = (event) => {
    setSearchBasedOn(event.target.value);
  };
  const handleSelectedTitle = (event) => {
    setSelectedTitle(event.target.value);
    setSelectedCity("");
  };
  const handleSelectedCity = (event) => {
    setSelectedCity(event.target.value);
    setSelectedTitle("");
  };

  useEffect(()=>{
    setRenderJobs(filter.jobPost)
  },[])

  // useEffect(()=>{

  // },[])

  return (
    <>
    <div className="share">
      {user?.role !== "company" && (
        <div className="search-container">
          <div className="top">
            {/* <img src={user.profilePicture} alt="" /> */}
            <form>
              <div className="jobsearch-card">
                <div className="jobsearch-top">

                <label htmlFor="dropdown">Filter by:</label>
                <select
                style={darkMode ?{backgroundColor:"#333333"}:{backgroundColor:"#F6F3F3"}}
                  id="dropdown"
                  value={searchBasedOn}
                  onChange={handleSearchBasedOn}
                  >
                  <option value="Title">Title</option>
                  <option value="City">City</option>
                </select>
                </div>
                {searchBasedOn == "Title" && (
                  <div className="sel-job">
                    {/* <label htmlFor="dropdown">Select Job Title:</label>
                    <select
                      id="dropdown"
                      value={selectedTitle}
                      onChange={handleSelectedTitle}
                    >
                      <option value="option1"></option>
                      <option value="qa">qa</option>
                      <option value="software">software</option>
                      <option value="full stack">full stack</option>
                    </select> */}

                      <input type="text" alt="" placeholder="title" onChange={handleSelectedTitle} value={selectedTitle}/>
                  </div>
                )}
                {searchBasedOn == "City" && (
                  <div>
                    {/* <label htmlFor="dropdown">Select City:</label>
                    <select
                      id="dropdown"
                      value={selectedCity}
                      onChange={handleSelectedCity}
                    >
                      <option value="option1"></option>
                      <option value="amman">amman</option>
                      <option value="irbid">irbid</option>
                      {/* <option value="option4">Option 3</option>
                    </select> */}

                    <input type="text" alt="" placeholder="City" onChange={handleSelectedCity} value={selectedCity}/>
                  </div>
                )}
              </div>
            </form>
          </div>
          <hr />
          <div className="bottom-search">
            <div className="right">
              <button onClick={handleSearch}>Search</button>
              {flag && 
                <button onClick={handelFlag}>Clear Search</button>
              }

            </div>
          </div>
        </div>
      )}
    </div>
    <div className="posts">
      {console.log("renderJobs====>",renderJobs)}
      {flag ? 
      renderJobs.map(post=>(
    
        <JobPost post={post} key={post.id}/>
      )):
      filter.jobPost.map(post=>(
    
        <JobPost post={post} key={post.id}/>
      ))}
    
 </div>
</>
  );
};

export default JobSearch;
