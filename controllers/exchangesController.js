const Exchange = require("../models/chartDataModel");
const ChartData = require("../models/chartDataModel");

// exports.getExchanges = async (req, res, next) => {
//   try {
//     const exchanges = await ChartData.find();

//     return res.status(200).json({ exchanges });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getExchanges = async (req, res, next) => {
  try {
    const exchanges = await Exchange.find();

    return res.status(200).json({ exchanges });
  } catch (error) {
    next(error);
  }
};

exports.saveUserExchange = async (req, res, next) => {
  try {
    const exchanges = req.body;

    const newUser = new Exchange({ exchanges });

    await newUser.save();

    res.status(201).json({ message: "User data saved successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserExchange = async (req, res, next) => {
  try {
    const updatedExchanges = req.body;

    for (const updatedExchange of updatedExchanges) {
      console.log(updatedExchange, "updatedExchanges");
      // eslint-disable-next-line no-underscore-dangle
      //const filter = { _id: updatedExchange._id };
      const update = { $set: updatedExchange };
      const options = { new: true, upsert: true };

      // eslint-disable-next-line no-await-in-loop
      const reso = await Exchange.findOneAndUpdate(update, options);
      console.log(reso, "res");
    }

    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
