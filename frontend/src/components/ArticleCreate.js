import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createArticle } from "../actions/articleActions";
import axios from "axios";

//editor
import Editor from "draft-js-plugins-editor";
import { EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

// end

const ArticleCreate = ({ history }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature_img, setFeatureImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tag, setTag] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
  }

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
        tag,
      }),
    );
    dispatch({ type: "ARTICLE_CREATE_RESET" });
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
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ArticleCreate;

// // adding functions to editor

// const onChange = (editorState) => {
//     setEditorState(editorState);
//   };

//   const handleKeyCommand = (command) => {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       onChange(newState);
//       return "handled";
//     }
//     return "not-handled";
//   };

//   const onUnderlineClick = (e) => {
//     e.preventDefault();
//     onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
//   };

//   const onBoldClick = (e) => {
//     e.preventDefault();
//     onChange(() => RichUtils.toggleInlineStyle(editorState, "BOLD"));
//   };

//   const onItalicClick = (e) => {
//     e.preventDefault();
//     onChange(() => RichUtils.toggleInlineStyle(editorState, "ITALIC"));
//   };

//   const onStrikeThroughClick = (e) => {
//     e.preventDefault();
//     onChange(() => RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
//   };

//   const onHighlight = (e) => {
//     e.preventDefault();
//     onChange(() => RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
//   };
//   // end of functions

// <Form.Group>
//                 <div className="editorContainer">
//                   <button className="underline" onClick={onUnderlineClick}>
//                     U
//                   </button>
//                   <button className="bold" onClick={onBoldClick}>
//                     <b>B</b>
//                   </button>
//                   <button className="italic" onClick={onItalicClick}>
//                     <em>I</em>
//                   </button>
//                   <button
//                     className="strikethrough"
//                     onClick={onStrikeThroughClick}>
//                     abc
//                   </button>
//                   <button className="highlight" onClick={onHighlight}>
//                     <span style={{ background: "yellow", padding: "0.3em" }}>
//                       H
//                     </span>
//                   </button>
//                 </div>
//                 <div
//                   style={{
//                     border: "1px solid black",
//                     minHeight: "6em",
//                     cursor: "text",
//                   }}
//                   onClick={focusEditor}>
//                   <Editor
//                     ref={editor}
//                     editorState={editorState}
//                     onChange={onChange}
//                     handleKeyCommand={handleKeyCommand}
//                     placeholder="Write something!"
//                     value={editorState}
//                   />
//                 </div>
//               </Form.Group>
