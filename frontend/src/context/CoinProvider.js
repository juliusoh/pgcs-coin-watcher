import React, { useState } from "react";
import axios from "axios";
import { createContext } from "react";
export const CoinContext = createContext();

let isFetched = false;

export const CoinProvider = (props) => {
  const [categories, setCategories] = useState([]);

  // IF I FIX THE SCRIPT FOR SUBCATEGORIES then use this code.
  // const processData = (data) => {
  //   const newData = {};
  //   Object.keys(data).forEach(category => {
  //     newData[category] = {}
  //     let subCategories = data[category].map(item => item.subCategory)
  //     subCategories = new Set(subCategories)
  //     console.log(subCategories)
  //   })
  //   return newData
  // }

  const fetchCategories = async () => {
    if (isFetched) {
      return
    }
    let { data } = await axios.get("/api/coins/categories");
    // data = processData(data)
    console.log("Fetching Data from API..");
    console.log(data)
    setCategories(data);
    isFetched = true;
  };



  return (
    <CoinContext.Provider value={{ categories, fetchCategories }}>
      {props.children}
    </CoinContext.Provider>
  );
};
