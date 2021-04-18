import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createArticle } from "../actions/articleActions";
import axios from "axios";

const ArticleCreate = ({ history }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature_img, setFeatureImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const articleCreate = useSelector((state) => state.articleCreate);
  const { loading, error, article, success } = articleCreate;

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
      createArticle({
        text,
        title,
        description,
        feature_img,
      }),
    );
    dispatch({ type: "ARTICLE_CREATE_RESET" });
    history.push("/");
    window.location.reload();
  };
  //           End submit handler    ///

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Article</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
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

            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ArticleCreate;
