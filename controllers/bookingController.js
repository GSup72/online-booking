const Booking = require("../models/booking");

exports.createBookings = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, numOfGuests, name, phone } = req.body;

    const booking = await Booking.create({
      listing: listingId,
      checkIn,
      checkOut,
      numOfGuests,
      name,
      phone,
    });

    res.status(200).json({
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};
