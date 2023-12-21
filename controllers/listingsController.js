const db = require("../db");

module.exports.reviews_get = async (req, res) => {
  const collection = db.collection("listingsAndReviews");
  const limit = 10;
  const skip = 0;

  try {
    const reviews = await collection.find({}).skip(skip).limit(limit).toArray();
    res.json(reviews);
  } catch (error) {
    console.error("Error while trying to get reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};
