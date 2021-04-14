import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { detailArticle } from "../actions/articleActions";

const ArtcileDetail = ({ match }) => {
  const dispatch = useDispatch();

  const articleDetail = useSelector((state) => state.articleDetail);
  const { loading, article, error } = articleDetail;

  useEffect(() => {
    if (article._id || !article._id !== match.params.id) {
      dispatch(detailArticle(match.params.id));
    }
  }, [match, article._id, dispatch]);

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
          <Card>
            <Card.Img variant="top" src={article.feature_img} />
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.description}</Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default ArtcileDetail;
