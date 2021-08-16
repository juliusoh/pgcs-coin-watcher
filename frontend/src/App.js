import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import CoinCategoryScreen from "./screens/CoinCategoryScreen";
import { CoinProvider } from "./context/CoinProvider";

const App = () => {
  return (
    <CoinProvider>
      <Router>
        <main className="py-3">
          <Container>
            <Route path="/" component={HomeScreen} exact />
            <Route path="/:category" component={CoinCategoryScreen} />
          </Container>
        </main>
      </Router>
    </CoinProvider>
  );
};

export default App;
