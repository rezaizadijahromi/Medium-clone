import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createArticle } from "../actions/articleActions";
import axios from "axios";

import "../index.css";

//editor
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

// end

const ArticleCreate = ({ history, match }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature_img, setFeatureImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tag, setTag] = useState("");
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const dispatch = useDispatch();
  const articleCreate = useSelector((state) => state.articleCreate);
  const { loading, error } = articleCreate;

  // connect socket io
  useEffect(() => {
    const s = io("http://localhost:5000");
    setSocket(s);
    console.log(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", socket.id);
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // end socket io useEffect

  // Callbacl function
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);
  // End callback

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
    const description = quill.getContents();
    e.preventDefault();
    dispatch(
      createArticle({
        text,
        title,
        description,
        feature_img,
        tag,
      }),
    );

    history.push("/");
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
              <div className="container" ref={wrapperRef}></div>
            </Form.Group>
            <Button type="submit" variant="primary" onSubmit={submitHandler}>
              Submit
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ArticleCreate;
