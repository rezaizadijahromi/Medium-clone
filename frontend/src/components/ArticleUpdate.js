import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  deleteArticle,
  detailArticle,
  updateArticle,
} from "../actions/articleActions";
import axios from "axios";

const ArticleUpdate = ({ history, match }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature_img, setFeatureImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tag, setTag] = useState("");

  const dispatch = useDispatch();

  const articleDetail = useSelector((state) => state.articleDetail);
  const { loading, article, error } = articleDetail;
  console.log(article);

  const articleUpdate = useSelector((state) => state.articleUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = articleUpdate;

  //               Start delete           //

  const articleDelete = useSelector((state) => state.articleDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = articleDelete;

  //               End delete           //

  //               Start Use Effect        //
  useEffect(() => {
    if (article._id || !article._id !== match.params.id) {
      dispatch(detailArticle(match.params.id));
    } else {
      setText(article.text);
      setTitle(article.title);
      setDescription(article.description);
      setTag(article.tag);
      setFeatureImage(article.feature_img);
    }
  }, [
    match,
    article._id,
    article.title,
    article.text,
    article.description,
    article.feature_img,
    article.tag,
    dispatch,
  ]);
  //               End Use Effect        //

  //           Start upload file handler    ///
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
      setFeatureImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  //           End upload file handler    ///

  //           Start submit handler    ///
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateArticle({
        _id: match.params.id,
        text,
        title,
        description,
        tag,
        feature_img,
      }),
    );
    history.push(`/article/${match.params.id}`);
    dispatch({ type: "ARTICLE_UPDATE_RESET" });
  };
  //           End submit handler    ///

  //           Start delete handler           //
  const deleteHandeler = (e, articleId) => {
    e.preventDefault();
    dispatch(deleteArticle(articleId));
    history.push("/");
    window.location.reload();
  };
  //           End delete handler           //

  return (
    <>
      <Link to={`/article/${match.params.id}`} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Update Article</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="text">
              <Form.Label>text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter text"
                value={text}
                onChange={(e) => setText(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="tag">
              <Form.Label>tag</Form.Label>
              <Form.Control
                type="tag"
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="featureImage">
              <Form.Label>featureImage</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter featureImage url"
                value={feature_img}
                onChange={(e) =>
                  setFeatureImage(e.target.value)
                }></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}></Form.File>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" onSubmit={submitHandler}>
              Submit
            </Button>

            {loadingDelete ? (
              <Loader />
            ) : (
              <Button
                variant="danger"
                className="float-right"
                onClick={(e) => deleteHandeler(e, match.params.id)}>
                Delete Article
              </Button>
            )}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ArticleUpdate;
