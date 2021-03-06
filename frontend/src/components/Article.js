import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Col, Card, Container } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listArticle } from "../actions/articleActions";
import Paginate from "./Paginate";

const Article = ({ article, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  console.log(keyword);
  const dispatch = useDispatch();
  const articleList = useSelector((state) => state.articleList);
  const { loading, articles, error, page, pages } = articleList;
  console.log(articles);

  useEffect(() => {
    dispatch(listArticle(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      {!keyword ? (
        ""
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <Container>
        <h1>Latest Articles</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Col>
              {articles.map((article) => (
                <Card className="my-3 p-3 rounded" key={article._id}>
                  <Link to={`/article/${article._id}`}>
                    <Card.Img src={article.image} variant="top"></Card.Img>
                  </Link>

                  <Card.Body>
                    <Link to={`/article/${article._id}`}>
                      <Card.Title as="div">
                        <strong>{article.title}</strong>
                      </Card.Title>
                    </Link>
                  </Card.Body>

                  <Card.Text as="div">{article.text}</Card.Text>
                </Card>
              ))}
            </Col>

            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Article;
