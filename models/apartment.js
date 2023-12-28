const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  apartmentType: { type: String, required: true },
  price: { type: Number, required: true },
  numOfGuests: { type: Number, required: true },
  address: { type: String },
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
