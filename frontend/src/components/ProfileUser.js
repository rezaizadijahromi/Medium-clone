import React, { useState, useEffect } from "react";
import FollowCM from "./FollowCM";
import { Form, Button, Row, Col, Container, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

import { getUserProfile } from "../actions/userActions";

// we need to list user orders

const ProfileUser = ({ location, history, match }) => {
  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);

  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!user || !user.name || success) {
      dispatch(getUserProfile(match.params.id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setImage(user.image);
    }
  }, [dispatch, history, userInfo, user, success, match]);

  const userProfileHandler = (userId) => {
    dispatch(getUserProfile(userId));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>User Profile</h2>
          {message && <Message variant="danger">{message}</Message>}
          {}
          {success && <Message variant="success">Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form>
              <Row>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Followers
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {user.followers.map((userFollowers) => {
                        return (
                          <LinkContainer to={`${userFollowers.user}`}>
                            <Dropdown.Item key={userFollowers.user}>
                              <Button
                                onClick={() =>
                                  userProfileHandler(userFollowers.user)
                                }>
                                {userFollowers.name}
                              </Button>
                            </Dropdown.Item>
                          </LinkContainer>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Following
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {user.following.map((userFollowing) => {
                        return (
                          <LinkContainer to={`${userFollowing.user}`}>
                            <Dropdown.Item key={userFollowing.user}>
                              <Button
                                onClick={() =>
                                  userProfileHandler(userFollowing.user)
                                }>
                                {userFollowing.name}
                              </Button>
                            </Dropdown.Item>
                          </LinkContainer>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <FollowCM image={image} />

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
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileUser;
