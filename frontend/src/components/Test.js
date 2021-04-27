import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import io from "socket.io-client";

let socket;
const ENDPOINT = "http://localhost:5000";

const Test = () => {
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);

    console.log(socket);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name);
    socket.emit("message", { name, family });
  };
  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="name">
        <Form.Label>name</Form.Label>
        <Form.Control
          type="name"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group controlId="family">
        <Form.Label>family</Form.Label>
        <Form.Control
          type="family"
          placeholder="Enter family"
          value={family}
          onChange={(e) => setFamily(e.target.value)}></Form.Control>
      </Form.Group>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
};

export default Test;
