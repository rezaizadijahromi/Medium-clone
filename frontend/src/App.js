import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Article from "./components/Article";
import ArtcileDetail from "./components/ArtcileDetail";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Article} exact />
        <Route path="/article/:id" component={ArtcileDetail} />
        {/* <Container>
        </Container> */}
      </main>
      <Footer />
    </Router>
  );
};

export default App;
