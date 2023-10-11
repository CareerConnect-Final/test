import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ApplicantCard from "../../components/applicantsCard/applicant";
import { useParams } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const authToken = cookie.load("auth");

  const [applicants, setApplicants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filterApplicantsByCategory = (category) => {
    if (category === "all") {
      return applicants; // No filtering, return all applicants
    }
    return applicants.filter((applicant) => applicant.status === category);
  };

  const handleInterviewResponse = (applicantId, status, interviewData) => {
    // Update the applicant's status and interview data
    const updatedApplicants = applicants.map((applicant) => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status,
          interviewDate: interviewData.date,
          interviewLocation: interviewData.location,
        };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);
  };

  const handleRejectionResponse = (applicantId, status, rejectionReason) => {
    // Update the applicant's status and rejection reason
    const updatedApplicants = applicants.map((applicant) => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status,
          rejectionReason,
        };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);
  };

  useEffect(() => {
    // Fetch applicants for the given job ID

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get(`https://final-backend-nvf1.onrender.com/home/applicants/${jobId}`, {
        headers,
      })
      .then((response) => {
        const { applicants } = response.data;
        setApplicants(applicants);
      })
      .catch((error) => {
        console.error("Error while fetching applicants:", error);
      });
  }, [jobId, authToken]);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Applications</h1>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <label htmlFor="categorySelector">Select Category: </label>
        <select
          id="categorySelector"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <Grid container spacing={2}>
        {filterApplicantsByCategory(selectedCategory).map((applicant) => (
          <Grid item key={applicant.id} xs={12} sm={6} md={4} lg={4}>
            <ApplicantCard
              applicant={applicant}
              onInterviewResponse={handleInterviewResponse}
              onRejectionResponse={handleRejectionResponse}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ApplicantsPage;
