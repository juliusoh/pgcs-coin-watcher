import express from "express";
import asyncHandler from "express-async-handler";
import Coin from "../models/coin.js";

const router = express.Router();



// router.get(
//   "/make-coin",
//   asyncHandler(async (req, res) => {
//     const data = {
//       fullName: 'tameems stupid coin',
//       specNo: "2795asdfsds",
//       coinName: "tameem",
//       category: "Bullion Coins",
//       array: [
//         {
//           GradeName: "35",
//           PopulationCount: "1",
//         },
//         {
//           GradeName: "40",
//           PopulationCount: "2",
//         },
//       ],
//     };

//     const coin = new Coin(data);
//     coin.save(function (err, result) {
//       res.json(result);
//       console.log(err);
//     });
//   })
// );


// @desc Fetch All Coin's Categories
// @route /api/coins/categories
// @access Public
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const categories = await Coin.find().distinct(
      "category",
      (err, results) => {
        res.json(results);
      }
    );
  })
);

// @desc Fetch All Coins by Category
// @route /api/coins/categories/
// @access Public

router.get(
  "/categories/:category",
  asyncHandler(async (req, res) => {
    const { category } = req.params;
    const fullName = category.replace(/-/g, " ");

    // todays coins
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const todaysCoins = await Coin.find({
      category: {
        $regex: new RegExp(fullName, "i"),
      },
      // createdAt: {
      //   $gte: today,
      // },
    }).lean();
    res.json(todaysCoins);

    // loop thru all todays coins
    // compare to yesterdays coins
      // loop thru array of today and compare to yesterday and add trend
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // get all coins distinct
    const categories = {};

    // later change add full name
    const coins = await Coin.aggregate([
      {
        $group: {
          _id: "$category",
          coins: {
            $addToSet: {
              subCategory: "$subCategory",
              fullName: "$fullName",
              coinName: "$coinName",
              specNo: "$specNo",
              id: "$_id",
              coinData: "$array",
            },
          },
        },
      },
    ]).allowDiskUse(true);
    coins.forEach((coin) => {
      const { _id, coins } = coin;
      categories[_id] = coins;
    });
    res.json(categories);
  })
);

// @desc Fetch Coin by Id
// @route /api/coins/:id
// @access Public
router.get(
  "/:specNo/:coinName",
  asyncHandler(async (req, res) => {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const todayCoin = await Coin.findOne({
      ...req.params,
      createdAt: {
        $gte: today,
      },
    }).lean();
    const startYest = new Date(Date.now());
    // hours, minutes, seconds, ms
    startYest.setHours(0, 0, 0, 0);
    const oneDayAgo = startYest.getDate() - 1;
    startYest.setDate(oneDayAgo);

    const endYest = new Date(Date.now());
    // hours, minutes, seconds, ms
    endYest.setHours(23, 59, 59);
    const endYestDayAgo = endYest.getDate() - 1;
    endYest.setDate(endYestDayAgo);
    // its between midnight yesterday and midnight today
    // startYest 12 AM to endYest 11:59PM;
    const yesterdayCoin = await Coin.findOne({
      ...req.params,
      createdAt: {
        $gte: startYest,
        $lt: endYest,
      },
    }).lean();
    //find one fix the deltemany script !

    const arrayYesterday = yesterdayCoin.array;
    const arrayToday = todayCoin.array;

    for (let i in arrayToday) {
      let trend = 0;
      if (!arrayYesterday[i]) {
        arrayToday[i].trend = trend;
        continue;
      }

      const todayPopCount = Number(arrayToday[i].PopulationCount || 0);
      const yesPopCount = Number(arrayYesterday[i].PopulationCount || 0);

      // console.log('yesterday', yesPopCount)
      // console.log('today', todayPopCount)

      trend = todayPopCount - yesPopCount;
      arrayToday[i].trend = trend;
    }

    todayCoin.array = arrayToday;

    if (todayCoin) {
      res.json(todayCoin);
    } else {
      res.status(404).json({ message: "Coin not found" });
    }
  })
);

export default router;
