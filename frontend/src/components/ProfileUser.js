import React, { useState, useEffect } from "react";
import FollowCM from "./FollowCM";
import {
  Button,
  Row,
  Col,
  Container,
  Dropdown,
  Card,
  ListGroup,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

import {
  getUserProfile,
  followUser,
  updateUserProfile,
} from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

// we need to list user orders

const ProfileUser = ({ location, history, match }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user, articles } = userProfile;
  console.log("User 1", user);
  const { userInfo } = userLogin;
  console.log(articles);

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  //             UseEffect        //
  useEffect(() => {
    if (!user || !user.name || success) {
      if (userInfo._id === match.params.id) {
        dispatch(getUserProfile("profile"));
      } else {
        dispatch(getUserProfile(match.params.id));
        console.log("Iam dispatching");
      }
    } else {
      setName(user.name);
      setEmail(user.email);
      setImage(user.image);
    }
  }, [dispatch, userInfo, user, success, match]);
  //               End userEffect           ///

  // start follow //

  let followed = userInfo.following.map(
    (usr) => usr.user.toString() === match.params.id.toString(),
  );

  let userFollowed = false;
  followed.forEach((element) => {
    if (element === true) {
      return (userFollowed = element);
    }
  });

  console.log("userFollowed", userFollowed);

  // end follow //

  //      Follow and UnFollow        //
  const userFollowHandler = (userId) => {
    // dispatch({ type: USER_UPDATE_PROFILE_RESET });
    dispatch(followUser(userId));
    history.push(`/profile/${match.params.id}`);
    // window.location.reload();
  };
  //          end follow and unfollow           //

  // Show the followers and followings //
  const userProfileHandler = (userId) => {
    if (userInfo._id === userId) {
      history.push("/profile");
      window.location.reload();
    } else {
    }
  };
  //          end profile handler         //

  //   Going into article
  const articlesHandler = (e, articleId) => {
    e.preventDefault();
    history.push(`/article/${articleId}`);
  };
  // end
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Container>
          <Message variant="danger">{error}</Message>
          <Button onClick={() => userFollowHandler(match.params.id)}>
            Send Following Request
          </Button>
        </Container>
      ) : (
        <Col md={2} style={{ position: "absolute", top: "50%" }}>
          <ListGroup as="ul" variant="flush" block>
            <ListGroup.Item as="li" active>
              {user.name}'s Articles
            </ListGroup.Item>
            <ListGroup.Item as="li">
              {articles.length > 0
                ? articles.map((article) => (
                    <Button
                      block
                      className="mx-1"
                      variant="info"
                      onClick={(e) => articlesHandler(e, article._id)}>
                      {article.title}
                    </Button>
                  ))
                : "No Article"}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      )}

      <Container>
        <Row>
          <Col>
            <h2>User Profile</h2>
            {message && <Message variant="danger">{message}</Message>}

            {success && <Message variant="success">Profile Updated</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              ""
            ) : (
              // <Message variant="danger">{error}</Message>
              <Row>
                <Col md={{ span: 0 }}>
                  <Button onClick={() => userFollowHandler(match.params.id)}>
                    {user.followers.find(
                      (usr) => usr.user.toString() === userInfo._id.toString(),
                    )
                      ? "UnFollow"
                      : "Follow"}
                  </Button>
                </Col>

                <Col md={{ span: 0, offset: 1 }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Followers
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {user.followers.length > 0 ? (
                        user.followers.map((userFollowers) => {
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
                        })
                      ) : (
                        <Col>
                          <Message>No Followers</Message>
                        </Col>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col md={{ span: 2, offset: 5 }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Following
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {user.following.length > 0 ? (
                        user.following.map((userFollowing) => {
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
                        })
                      ) : (
                        <Col>
                          <Message>You Follow No one</Message>
                        </Col>
                      )}
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
    </>
  );
};

export default ProfileUser;
