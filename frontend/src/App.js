import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Article from "./components/Article";
import ArtcileDetail from "./components/ArtcileDetail";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/" component={Article} exact />
          <Route path="/article/:id" component={ArtcileDetail} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
