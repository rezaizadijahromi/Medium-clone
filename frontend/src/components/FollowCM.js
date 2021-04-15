import React from "react";
import { Button, Row, Col, Container, Image, Card } from "react-bootstrap";

const FollowCM = ({ image }) => {
  return (
    <Container>
      <Card className="my-3 p-3 rounded">
        <Image src={image} thumbnail />
      </Card>
    </Container>
  );
};

export default FollowCM;
