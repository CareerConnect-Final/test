import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 340, // Fixed width
    height: 350, // Fixed height
    padding: "16px",
    marginBottom: "20px", // Add margin for spacing
    marginRight: "20px", // Right margin for spacing
    marginLeft: "20px", // Left margin for spacing
    position: "relative", // Make the card a positioning context
  },
  media: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    marginBottom: "16px",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    background: "white", // Set the background color if needed
  },
};

const ApplicantCard = ({ applicant }) => {
  const authToken = cookie.load("auth");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: "",
    location: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const handleViewCV = (cvLink) => {
    const newWindow = window.open(cvLink, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null; // Prevent the new window from having access to the opener window.
    }
  };

  const handleAppointInterview = () => {
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setIsRejectionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRejectionModalOpen(false);
  };

  const handleInterviewDataChange = (event) => {
    const { name, value } = event.target;
    setInterviewData({
      ...interviewData,
      [name]: value,
    });
  };

  const handleRejectionReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleInterviewSubmit = () => {
    // Prepare the data for the interview submission
    const data = {
      status: "interview",
      interviewDate: interviewData.date,
      interviewLocation: interviewData.location,
    };

    // Prepare the headers with the authorization token
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    // Make an HTTP POST request to your backend route with headers
    axios
      .post(
        `https://final-backend-nvf1.onrender.com/home/jobresponse/${applicant.id}`,
        data,
        { headers }
      )
      .then((response) => {
        // Handle success, e.g., show a success message to the user
        console.log("Interview response submitted successfully");
        // Close the interview modal
        setIsModalOpen(false);
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message to the user
        console.error("Error submitting interview response", error);
      });
    setIsModalOpen(false);
  };

  const handleRejectionSubmit = () => {
    const data = {
      status: "rejected",
      rejectionReason: rejectionReason,
    };

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .post(
        `https://final-backend-nvf1.onrender.com/home/jobresponse/${applicant.id}`,
        data,
        { headers }
      )
      .then((response) => {
        console.log("Rejection response submitted successfully");

        setIsRejectionModalOpen(false);
      })
      .catch((error) => {
        console.error("Error submitting rejection response", error);
      });
    setIsRejectionModalOpen(false);
  };

  return (
    <Card sx={styles.card}>
      <CardMedia
        component="img"
        sx={styles.media}
        image={applicant.user?.profilePicture}
        alt="Profile Picture"
      />
      <CardContent>
        <Typography variant="h6" component="div">
        {applicant.user?.username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {applicant.user?.bio}
        </Typography>
      </CardContent>
      <div sx={styles.buttonContainer}>
        {applicant.status === "pending" && (
          <>
            <Button
              variant="contained"
              sx={{ margin: "4px" }}
              onClick={() => handleViewCV(applicant.cv_link)}
            >
              View CV
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ margin: "4px" }}
              onClick={handleAppointInterview}
            >
              Interview
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: "4px" }}
              onClick={handleReject}
            >
              Reject
            </Button>
          </>
        )}
        {applicant.status === "interview" && (
          <>
            <Button
              variant="contained"
              sx={{ margin: "4px" }}
              onClick={() => handleViewCV(applicant.cv_link)}
            >
              View CV
            </Button>
            {/* Add Interview Info button here */}
          </>
        )}
        {applicant.status === "rejected" && (
          <Button
            variant="contained"
            sx={{ margin: "4px" }}
            onClick={() => handleViewCV(applicant.cv_link)}
          >
            View CV
          </Button>
        )}
      </div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            width: "400px", // Increase width for more space
          }}
        >
          <div>
            <h2>Enter Interview Data</h2>
            <div style={{ margin: "10px 0" }}>
              {" "}
              {/* Add margin */}
              <label>Date:</label>
              <input
                type="text" // Display date as a string
                name="date"
                value={interviewData.date}
                placeholder="Interview date"
                onChange={handleInterviewDataChange}
                style={{ marginLeft: "10px" }} // Align and add margin
              />
            </div>
            <div style={{ margin: "10px 0" }}>
              {" "}
              {/* Add margin */}
              <label>Location:</label>
              <input
                type="text"
                name="location"
                placeholder="Interview Location"
                value={interviewData.location}
                onChange={handleInterviewDataChange}
                style={{ marginLeft: "10px" }} // Align and add margin
              />
            </div>
            <Button
              variant="contained"
              color="success"
              onClick={handleInterviewSubmit}
              sx={{ marginTop: "20px" }}
            >
              Submit Interview
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={isRejectionModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            width: "400px",
          }}
        >
          <div>
            <h2>Enter Rejection Reason</h2>
            <div style={{ margin: "10px 0" }}>
              <input
                type="text"
                name="rejectionReason"
                placeholder="Rejection Reason"
                value={rejectionReason}
                onChange={handleRejectionReasonChange}
                style={{ width: "100%", margin: "10px 0" }}
              />
            </div>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectionSubmit}
              sx={{ marginTop: "20px" }}
            >
              Submit Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default ApplicantCard;
