const Booking = require("../models/booking");

module.exports.createBookings = async (req, res) => {
  try {
    const { apartmentId, checkIn, checkOut, numOfGuests, phone } = req.body;
    const userId = req.user.userId;

    //  console.log("Received request with data:", req.body);

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

module.exports.getAllBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({ user: userId });

    res.status(200).json({
      bookings,
    });
  } catch (err) {
    console.error("Error:", err);

    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete the booking
    await Booking.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
