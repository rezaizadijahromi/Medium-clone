import React, { useState, useEffect } from "react";
import FollowCM from "./FollowCM";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Dropdown,
  ListGroup,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

import {
  getUserProfile,
  updateUserProfile,
  getUserNotif,
  acceptNotif,
  denieNotif,
} from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

// we need to list user orders

const Profile = ({ location, history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user, articles } = userProfile;
  const { userInfo } = userLogin;
  console.log(articles);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Private");

  const dispatch = useDispatch();

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  // get user notifications
  const userNotif = useSelector((state) => state.userNotif);
  const { loading: loadingNotif, error: errorNotif, notifications } = userNotif;

  console.log(notifications);
  // end

  // accept user following request
  const userAcceptNotif = useSelector((state) => state.userAcceptNotif);
  const {
    loading: loadingAccept,
    error: errorAccept,
    success: successAccept,
  } = userAcceptNotif;
  //

  // denie user following request
  const userDenieNotif = useSelector((state) => state.userDenieNotif);
  const {
    loading: loadingDenie,
    error: errorDenie,
    success: successDenie,
  } = userAcceptNotif;
  //

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        history.push("/profile");
        dispatch(getUserProfile("profile"));
        if (successAccept || successDenie) {
          dispatch(getUserNotif());
        }

        dispatch({ type: USER_UPDATE_PROFILE_RESET });
      } else {
        setName(user.name);
        setEmail(user.email);
        setImage(user.image);
      }
    }
  }, [dispatch, history, userInfo, user, success, successAccept, successDenie]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password,
          image,
          accountStatus,
        }),
      );
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const userProfileHandler = (userId) => {
    if (userInfo._id.toString() === userId.toString()) {
      console.log("login  user", userInfo._id);
      console.log("profile  user", user._id);
      dispatch(getUserProfile("profile"));
      history.push("/profile");
      window.location.reload();
    } else {
      dispatch(getUserProfile(userId));
      console.log("not Handler profile");
      let followed = user.followers.find(
        (usr) => usr.user.toString() === userId.toString(),
      );

      console.log("4", followed);
    }
  };

  //   Going into article
  const articlesHandler = (e, articleId) => {
    e.preventDefault();
    history.push(`/article/${articleId}`);
  };
  // end
  console.log(articles);

  // Add article
  const addArticleHandler = (e) => {
    e.preventDefault();
    history.push("/add");
  };

  // End

  // notifications handler
  const acceptNotificationHandler = (e, notifId) => {
    e.preventDefault();
    dispatch(acceptNotif(notifId, "Active"));
    // window.location.reload();
  };
  // end

  // denie the following request
  const denieNotificationHandler = (e, notifId) => {
    e.preventDefault();
    dispatch(denieNotif(notifId));
  };
  // end

  return (
    <>
      <Col md={2} style={{ position: "absolute", top: "50%" }}>
        <ListGroup as="ul" variant="flush" block>
          <ListGroup.Item as="li" active>
            {user.name}'s Articles
          </ListGroup.Item>
          <ListGroup.Item as="li">
            {articles.map((article) => (
              <Button
                block
                className="mx-1"
                variant="info"
                onClick={(e) => articlesHandler(e, article._id)}>
                {article.title}
              </Button>
            ))}
          </ListGroup.Item>
        </ListGroup>

        <Button style={{ marginLeft: "75px" }} onClick={addArticleHandler}>
          Add Article
        </Button>

        <ListGroup as="ul" variant="flush" block className="my-3">
          <ListGroup.Item as="li" active>
            {user.name}'s Notifications
          </ListGroup.Item>
          <ListGroup.Item as="li">
            {user.notifications.map((notif) => (
              <Row>
                <Col block>
                  {notif.name}
                  <Button
                    className="mx-1"
                    variant="info"
                    onClick={(e) => acceptNotificationHandler(e, notif.user)}>
                    <i class="fas fa-check-square"></i>
                  </Button>
                  <Button
                    className="mx-1"
                    variant="info"
                    onClick={(e) => denieNotificationHandler(e, notif.user)}>
                    <i class="fas fa-trash"></i>
                  </Button>
                </Col>
              </Row>
            ))}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Container>
        <Col>
          <h2>Profile</h2>
          {message && <Message variant="danger">{message}</Message>}
          {}
          {success && <Message variant="success">Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={{ span: 0, offset: 1 }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Followers
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {user.followers.length > 0 ? (
                        user.followers.map((userFollowers) => {
                          return (
                            <LinkContainer to={`profile/${userFollowers.user}`}>
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
                            <LinkContainer to={`profile/${userFollowing.user}`}>
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

              <Form.Group inline>
                <label>AccountStatus</label>
                <Form.Check
                  type="radio"
                  label="Public"
                  checked={accountStatus === "Public"}
                  value="Public"
                  onClick={() => setAccountStatus("Public")}
                />
                <Form.Check
                  type="radio"
                  label="Private"
                  checked={accountStatus === "Private"}
                  value="Private"
                  onClick={() => setAccountStatus("Private")}
                />
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}></Form.Control>
                <Form.File
                  id="image-file"
                  label="Choose File"
                  custom
                  onChange={uploadFileHandler}></Form.File>
                {uploading && <Loader />}
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          )}
        </Col>
      </Container>
    </>
  );
};

export default Profile;
