import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { StateContext } from "../../context/state";
import cookie from "react-cookies";
import axios from "axios";

const ProfileModal = ({ isOpen, closeModal }) => {
  const authToken = cookie.load("auth");
  const user = cookie.load("user");
  const state = useContext(StateContext);

  // Initialize user data with default values from cookies
  const [userData, setUserData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    career: user?.career || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `https://final-backend-nvf1.onrender.com/home/users/${user?.id}`;
    const { bio, email, firstName, lastName, phoneNumber, career } = userData;

    const data = {
      bio,
      email,
      firstName,
      lastName,
      phoneNumber,
      career,
    };

    if (authToken === null) {
      throw new Error("Authentication token not found.");
    } else {
      axios
        .put(url, data, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          console.log(response.data);
          state.editUsers(response.data);
          closeModal();
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    }
  };
{console.log(userData.bio)}
  return (
    <Modal show={isOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUserName">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="text"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              placeholder="About"
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          </Form.Group>
          <Form.Group controlId="formCareer">
            <Form.Label>Career</Form.Label>
            <Form.Control
              type="text"
              name="career"
              value={userData.career}
              onChange={handleInputChange}
              placeholder="Career"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
