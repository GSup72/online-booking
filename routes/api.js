const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");
const apartmentController = require("../controllers/apartmentController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/reviews", verifyToken, listingsController.reviews_get);

router.post("/signin", authController.signin_post);
router.get("/signin", authController.signin_get);
router.post("/signup", authController.signup_post);
router.get("/signup", authController.signup_get);

router.post("/booking", verifyToken, bookingController.createBookings);
router.get("/bookings/:userId", verifyToken, bookingController.getAllBookings);
router.delete(
  "/bookings/:bookingId",
  verifyToken,
  bookingController.deleteBooking
);

router.post("/apartment", verifyToken, apartmentController.createApartment);
router.put(
  "/apartment/:apartmentId",
  verifyToken,
  apartmentController.editApartment
);
router.get(
  "/getAllApartment",
  verifyToken,
  apartmentController.getAllApartments
);
router.delete(
  "/deleteApartment/:apartmentId",
  verifyToken,
  apartmentController.deleteApartment
);

module.exports = router;
