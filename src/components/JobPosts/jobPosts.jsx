// import "./jobPosts.scss";
import {useContext}  from "react";
import JobPost from "../JobPost/jobPost";
import {JobContext}  from "../../context/stateJob"; // in the JobContext the first letter must always be a capital letter


const JobPosts = () => {


  const state=useContext(JobContext)

  return <div className="posts">

     {state.jobPost.map(post=>(
      
      <JobPost post={post} key={post.id}/>
    ))}
  </div>;
};

export default JobPosts;
