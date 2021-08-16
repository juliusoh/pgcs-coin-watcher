import { React } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { linkConverter } from "../util/Util";

const Coin = ({ category }) => {
  const link = linkConverter(category);

  return (
    <Card bg={"light"} className="my-3 p-3 rounded">
      <ListGroup variant="flush">
        <Link className={`links`} to={`/${link}`}>
          <ListGroup.Item  variant="success">{category}</ListGroup.Item>
        </Link>
      </ListGroup>
    </Card>
  );
};

export default Coin;
