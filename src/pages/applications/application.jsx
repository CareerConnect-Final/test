import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import ApplicantCard from "../../components/applicantsCard/applicant";

const ApplicantPage = () => {
  const { jobId, sender_id } = useParams();
  const authToken = cookie.load("auth");
  const user = cookie.load("user");
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicant, setFilteredApplicant] = useState(null);

  useEffect(() => {
    // Fetch all applicants for the specified job ID

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get(`https://final-backend-nvf1.onrender.com/home/applicants/${jobId}`, {
        headers,
      })
      .then((response) => {
        const applicantsData = response.data.applicants;
        setApplicants(applicantsData);
        console.log(applicantsData);
        // Filter the applicants based on sender_id
        const filteredApplicant = applicantsData.find(
          (applicant) => applicant.applyer_id == sender_id
        );

        setFilteredApplicant(filteredApplicant);
      })
      .catch((error) => {
        console.error("Error while fetching applicants:", error);
      });
  }, [jobId, sender_id, authToken]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      {filteredApplicant ? (
        <div style={{ margin: "20px" }}>
          <ApplicantCard applicant={filteredApplicant} />
        </div>
      ) : (
        <p>No matching applicant found for sender ID {sender_id}.</p>
      )}
    </div>
  );
};

export default ApplicantPage;
