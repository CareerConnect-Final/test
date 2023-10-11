import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import  {StateContext}  from "../../context/state";
import { JobContext } from "../../context/stateJob";
import cookie from "react-cookies";
import './jobModal.scss'
import axios from "axios";
import { DarkModeContext } from "../../context/darkModeContext";
function JobModal(props) {
  const {darkMode } = useContext(DarkModeContext);
  const newJob= useContext(JobContext)
  const newPost = useContext(StateContext);
  const [post, setPost] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const authToken = cookie.load("auth");
  async function editPost() {
    // if(props.check =="jobposts"){
      const url = `https://final-backend-nvf1.onrender.com/careerjob/jobs/${props.id}`;
      const data = {
        content: post,
        job_city:city,
        job_title:title,
        job_field:field
      };
      try {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };
        const response = await axios.put(url, data,{headers});
  console.log(data)
        newJob.editPost(response.data);
        // console.log("post",post)
          setPost("")
          setCity("")
          setTitle("")
          setField("")
        props.handleclose();
      } catch (error) {
        console.error("Error editing post", error);
      }
// }
}
  const handlePostChange = (e) => {
     setPost(e.target.value);
     console.log("post",post)
    };
    const handleCityChange = (e) => {
      setCity(e.target.value);
      console.log("city",city)
    };
    const handleTitleChange = (e) => {
      setTitle(e.target.value);
      console.log("title",title)
    };
    const handleFieldChange = (e) => {
      setField(e.target.value);
      console.log("field",field)
  };
  return (
    <>
     <Modal show={props.showFlag} onHide={props.handleclose} >
    <div className="inp-ed" style={{
            backgroundColor: darkMode ? "#333333" : "#FFFFFF",
            color: darkMode ? "white" : "black",
          }}>
        <Modal.Header closeButton  >
          <Modal.Title>{props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Image src={props.img} alt="cant show the pic!" /> */}
          <br></br>
          <br></br>
          <div className="inp-cont">
          <div className="inp1">
          <label style={{ marginRight: "5px" }}>Edit title</label>
          {darkMode ?<input style={{backgroundColor:"#222222", color:"white"}} type="text" onChange={handleTitleChange} />
          :<input type="text" onChange={handleTitleChange} />}
          </div>
          <div className="inp1">
          <label style={{ marginRight: "5px" }}>Edit field</label>
          {darkMode ?<input style={{backgroundColor:"#222222", color:"white"}} type="text" onChange={handleFieldChange} />
          :<input type="text" onChange={handleFieldChange} />}
          </div>
          <div className="inp1">
          <label style={{ marginRight: "5px" }}>Edit city</label>
          {darkMode ?<input style={{backgroundColor:"#222222", color:"white"}} type="text" onChange={handleCityChange} />
          :<input type="text" onChange={handleCityChange} />}
          </div>
          <div className="inp1">
          <label style={{ marginRight: "5px" }}>Edit post</label>
          {darkMode ?<input style={{backgroundColor:"#222222", color:"white"}} type="text" onChange={handlePostChange} />
          :<input type="text" onChange={handlePostChange} />}
          </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={editPost}>
            Submit
          </Button>
        </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
export default JobModal;