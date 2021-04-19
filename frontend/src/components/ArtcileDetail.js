import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Card,
  Container,
  Button,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  detailArticle,
  clapArticle,
  createArticleReview,
} from "../actions/articleActions";

import Rating from "./Rating";

const ArtcileDetail = ({ match, history }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  const articleDetail = useSelector((state) => state.articleDetail);
  const { loading, article, error } = articleDetail;
  console.log("article", article);

  const articleClap = useSelector((state) => state.articleClap);
  const { success: clapSuccess } = articleClap;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const articleCreateReview = useSelector((state) => state.articleCreateReview);

  const {
    error: errorArticleReview,
    loading: loadingArticleReview,
    success: successArticleReview,
  } = articleCreateReview;

  useEffect(() => {
    if (successArticleReview) {
      setRating(0);
      setComment("");
    }
    dispatch(detailArticle(match.params.id));
  }, [match, article._id, dispatch, clapSuccess, successArticleReview]);

  const clapHandler = (e) => {
    e.preventDefault();
    dispatch(clapArticle(match.params.id));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createArticleReview(match.params.id, {
        rating,
        comment,
      }),
    );
  };

  const editHandler = () => {
    if (article.author.user.toString() === userInfo._id.toString()) {
      history.push(`/article/${match.params.id}/edit`);
    } else {
      window.alert("You are not the author");
    }
  };

  // follow function

  // if the author is the user can edit the article

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {/* {article.author === userInfo._id.toString() ? (
        <Link className="btn btn-light my-3 float-right" to="/">
          Edit article
        </Link>
      ) : (
        ""
      )} */}
      <Link className="btn btn-light my-3 float-right" onClick={editHandler}>
        Edit article
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Container>
            <Col md={20}>
              <Card>
                <Card.Img variant="top" src={article.feature_img} />
                <Card.Body>
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Button onClick={clapHandler}>
                <i class="far fa-thumbs-up">{article.claps}</i>
              </Button>
            </Col>

            <Row>
              <Col md={6}>
                <h2>Reviews</h2>
                {article.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
                  {article.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Review</h2>
                    {successArticleReview && (
                      <Message variant="success">
                        Review submitted successfully
                      </Message>
                    )}
                    {loadingArticleReview && <Loader />}
                    {errorArticleReview && (
                      <Message variant="danger">{errorArticleReview}</Message>
                    )}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}>
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            value={comment}
                            onChange={(e) =>
                              setComment(e.target.value)
                            }></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={loadingArticleReview}
                          type="submit"
                          variant="primary">
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to="/login">sign in</Link> to write a
                        review{" "}
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default ArtcileDetail;
