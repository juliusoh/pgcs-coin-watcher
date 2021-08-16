import React, { useEffect, useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Coin from "../components/Coin";
import { CoinContext } from "../context/CoinProvider";
import { Loader } from "../components/Loader";

const HomeScreen = () => {
  let categories = {};
  const myContext = useContext(CoinContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myContext.fetchCategories().then(() => {
      setLoading(false);
    });
  }, [myContext]);

  categories = myContext.categories;
  return (
    <>
      <h1>PGCS Coins</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Row>
            {categories.map((cat, index) => (
              <Col key={index} sm={12} md={6} lg={4} xl={3}>
                <Coin category={cat} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
