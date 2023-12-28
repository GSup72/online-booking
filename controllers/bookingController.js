// Booking Controller
const Booking = require("../models/booking");

module.exports.createBookings = async (req, res) => {
  try {
    const { userId, apartmentId, checkIn, checkOut, numOfGuests, phone } =
      req.body;

    console.log("Received request with data:", req.body);

    const overlappingBooking = await Booking.findOne({
      apartment: apartmentId,
      $or: [
        {
          $and: [
            { checkIn: { $lte: checkIn } },
            { checkOut: { $gte: checkIn } },
          ],
        },
        {
          $and: [
            { checkIn: { $lte: checkOut } },
            { checkOut: { $gte: checkOut } },
          ],
        },
        {
          $and: [
            { checkIn: { $gte: checkIn } },
            { checkOut: { $lte: checkOut } },
          ],
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: "Overlapping booking dates" });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const booking = await Booking.create({
      user: userId,
      apartment: apartmentId,
      checkIn,
      checkOut,
      numOfGuests,
      phone,
    });

    //  console.log("Booking created:", booking);

    res.status(200).json({
      booking,
    });
  } catch (err) {
    console.error("Error:", err);

    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
