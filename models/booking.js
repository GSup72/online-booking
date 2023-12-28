// Booking Model
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  numOfGuests: {
    type: Number,
    required: true,
    validate: {
      validator: async function (value) {
        const apartment = await mongoose
          .model("Apartment")
          .findById(this.apartment);
        return value <= apartment.numOfGuests;
      },
      message: "Number of guests exceeds the maximum allowed for the apartment",
    },
  },
  phone: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
