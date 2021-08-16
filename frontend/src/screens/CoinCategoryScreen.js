import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../context/CoinProvider";
import { linkConverter } from "../util/Util";
import { Table, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader";

const CoinCategoryScreen = ({ history, match }) => {
  console.log(match.params.category);
  const linkCategory = match.params.category;
  let categories = {};
  const myContext = useContext(CoinContext);

  // how to set loader
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    myContext.fetchCategories().then(() => {
      setLoading(false);
    });
  }, [myContext]);

  categories = myContext.categories;
  const currentCategory = Object.keys(categories).find(
    (cat) => linkCategory === linkConverter(cat)
  );

  const currentCoinData = categories[currentCategory] || [];
  console.log(currentCoinData);
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>{currentCategory}</h1>
        </Col>
        <Link className="btn btn-dark my-3" to="/">
          Go Back
        </Link>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>SUBCATEGORY</th>
                <th>COIN NAME</th>
                <th>GRADE NAME : POPULATION</th>

              </tr>
            </thead>
            {currentCoinData.map((coin) => (
              <tr key={coin.id}>
                <td>{coin.subCategory}</td>
                <td>{coin.fullName || coin.coinName}</td>
                <td>
                  {coin.coinData.map((item) => (
                    <td key={item._id}><h6>{item.GradeName}</h6>{!item.PopulationCount ? 0 : item.PopulationCount}</td>
                  ))}
                </td>

              </tr>
            ))}
          </Table>
        </>
      )}
    </>
  );
};

export default CoinCategoryScreen;
