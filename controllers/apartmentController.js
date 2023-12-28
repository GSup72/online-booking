// Existing Apartment Controller
const Apartment = require("../models/apartment");
const db = require("../db");

module.exports.createApartment = async (req, res) => {
  try {
    const { name, description, apartmentType, price, numOfGuests } = req.body;

    // Enforce the global constraints on the number of guests
    if (numOfGuests < 1) {
      return res
        .status(400)
        .json({ error: "Number of guests must be highter than 1" });
    }

    const newApartment = new Apartment({
      name,
      description,
      apartmentType,
      price,
      numOfGuests,
    });

    await newApartment.save();
    res.status(201).json({ message: "Apartment created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
