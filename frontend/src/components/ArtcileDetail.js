import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { detailArticle, clapArticle } from "../actions/articleActions";

const ArtcileDetail = ({ match }) => {
  const dispatch = useDispatch();

  const articleDetail = useSelector((state) => state.articleDetail);
  const { loading, article, error } = articleDetail;

  const articleClap = useSelector((state) => state.articleClap);
  const {
    loading: clapLoading,
    error: clapError,
    success: clapSuccess,
  } = articleClap;

  const [clap, setClap] = useState(article.claps);

  useEffect(() => {
    if (article._id || !article._id !== match.params.id) {
      dispatch(detailArticle(match.params.id));
    }
  }, [match, article._id, dispatch, clapSuccess]);

  const clapHandler = (e) => {
    e.preventDefault();
    dispatch(clapArticle(match.params.id));
  };

  // follow function

  // if the author is the user can edit the article

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
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
          </Container>
        </>
      )}
    </>
  );
};

export default ArtcileDetail;
