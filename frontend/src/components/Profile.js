import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  Container,
  Dropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

import { getUserProfile, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

// we need to list user orders

const Profile = ({ location, history }) => {
  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);

  const { success } = userUpdateProfile;

  // list order section

  // end

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch(getUserProfile("profile"));
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  const userProfileHandler = (userId) => {
    dispatch(getUserProfile(userId));
  };

  return (
    <Row>
      <Col md={3}>
        <Container>
          <h2>User Profile</h2>
          {message && <Message variant="danger">{message}</Message>}
          {}
          {success && <Message variant="success">Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          )}
        </Container>
      </Col>

      <Col md={3}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Following
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {user.following.map((userFollowing) => {
              return (
                <LinkContainer to={`profile/${userFollowing.user}`}>
                  <Dropdown.Item key={userFollowing.user}>
                    <Button
                      onClick={() => userProfileHandler(userFollowing.user)}>
                      {userFollowing.name}
                    </Button>
                  </Dropdown.Item>
                </LinkContainer>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      <Col md={3}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Followers
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {user.followers.map((userFollowers) => {
              return (
                <LinkContainer to={`profile/${userFollowers.user}`}>
                  <Dropdown.Item key={userFollowers.user}>
                    <Button
                      onClick={() => userProfileHandler(userFollowers.user)}>
                      {userFollowers.name}
                    </Button>
                  </Dropdown.Item>
                </LinkContainer>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default Profile;
