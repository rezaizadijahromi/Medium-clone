import React, { useState, useEffect } from "react";
import FollowCM from "./FollowCM";
import { Button, Row, Col, Container, Dropdown, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

import {
  getUserProfile,
  followUser,
  UnfollowUser,
} from "../actions/userActions";

// we need to list user orders

const ProfileUser = ({ location, history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  //Follow
  const userFollow = useSelector((state) => state.userFollower);
  let {
    loading: followLoading,
    success: followSuccess,
    error: followError,
  } = userFollow;

  const userUnFollow = useSelector((state) => state.userUnFollower);
  let {
    loading: unFollowLoading,
    success: unFollowSuccess,
    error: unFollowError,
  } = userUnFollow;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);

  const { success } = userUpdateProfile;

  // Followed function

  // start follow //

  let followed = userInfo.following.map(
    (usr) => usr.user.toString() === match.params.id.toString(),
  );

  console.log("1", followed);

  // end follow //

  useEffect(() => {
    if (!user || !user.name || success) {
      if (userInfo._id === match.params.id) {
        dispatch(getUserProfile("profile"));
      } else {
        dispatch(getUserProfile(match.params.id));
      }
    } else {
      setName(user.name);
      setEmail(user.email);
      setImage(user.image);
    }
  }, [dispatch, history, userInfo, user, success, match, followSuccess]);

  followSuccess = followed;
  console.log("2", followSuccess);

  const userProfileHandler = (userId) => {
    if (userInfo._id === userId) {
      dispatch(getUserProfile("profile"));

      history.push("/profile");
      window.location.reload();
    } else {
      dispatch(getUserProfile(userId));
    }
  };

  const userFollowHandler = (userId) => {
    // e.preventDefault();

    if (followed) {
      dispatch(UnfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>User Profile</h2>
          {message && <Message variant="danger">{message}</Message>}

          {success && <Message variant="success">Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row>
              <Col md={{ span: 0, offset: 1 }}>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Followers
                  </Dropdown.Toggle>

                  <Col>
                    <Button onClick={() => userFollowHandler(match.params.id)}>
                      {followSuccess ? "UnFollow" : "Follow"}
                    </Button>
                  </Col>

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
              <Col md={{ span: 2, offset: 5 }}>
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
          )}

          <Card>
            <FollowCM image={image} />
            <Card.Body>
              <Card.Title>Name</Card.Title>
              <Card.Text>{name}</Card.Text>

              <Card.Title>Email</Card.Title>
              <Card.Text>{email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileUser;
