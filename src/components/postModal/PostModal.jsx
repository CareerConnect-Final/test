import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import  {StateContext}  from "../../context/state";
import { JobContext } from "../../context/stateJob";
import cookie from "react-cookies";

import axios from "axios";


function PostModal(props) {


  const newJob= useContext(JobContext)

  const newPost = useContext(StateContext);
  const [newData, setNewData] = useState("");
  const authToken = cookie.load("auth");
  
  async function editPost() {
    if(props.check =="posts"){
    const url = `https://final-backend-nvf1.onrender.com/api/v1/posts/${props.id}`;
    const data = {
      content: newData,
    };

    try {

      const response = await axios.put(url, data,);

      newPost.editPost(response.data);

      setNewData("");
      props.handleclose();
    } catch (error) {
      console.error("Error editing post", error);
    }
 
}else if(props.check=="comments"){

  const url = `https://final-backend-nvf1.onrender.com/api/v1/comments/${props.id}`;
  const data = {
    content: newData,
  };
  
  try {

      const response = await axios.put(url, data);

      newPost.editComments(response.data);

      setNewData("");
      props.handleclose();
    } catch (error) {
      console.error("Error editing post", error);
    }
  }else if(props.checkJob =="jobposts"){

console.log(props.checkJob)

    const url = `https://final-backend-nvf1.onrender.com/careerjob/jobs/${props.id}`;
    const data = {
      content: newData,
    };

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      const response = await axios.put(url, data,{headers});

      newJob.editPost(response.data);

      setNewData("");
      props.handleclose();
    } catch (error) {
      console.error("Error editing post", error);
    }
 
}else if(props.checkJob=="jobcomments"){

    const url = `https://final-backend-nvf1.onrender.com/careerjob/jobcomments/${props.id}`;
    const data = {
      content: newData,
    };

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      const response = await axios.put(url, data,{headers});

      newJob.editComments(response.data);

      setNewData("");
      props.handleclose();
    } catch (error) {
      console.error("Error editing post", error);
    }
  }
} 

  const handleCommentChange = (e) => {
    setNewData(e.target.value);
  };
  return (
    <>
      <Modal show={props.showFlag} onHide={props.handleclose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Image src={props.img} alt="cant show the pic!" /> */}
          <br></br>
          <br></br>
          <label style={{ marginRight: "5px" }}>Edit content</label>
          <input type="text" onChange={handleCommentChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleclose}>
            Close
          </Button>
          <Button variant="primary" onClick={editPost}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default PostModal;
