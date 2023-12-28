const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  apartmentType: { type: String, required: true },
  price: { type: Number, required: true },
  numOfGuests: { type: Number, required: true },
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
