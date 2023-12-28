const Apartment = require("../models/apartment");

module.exports.createApartment = async (req, res) => {
  try {
    const { name, description, apartmentType, price, numOfGuests, address } =
      req.body;

    const userId = req.user.userId;

    if (numOfGuests < 1) {
      return res
        .status(400)
        .json({ error: "Number of guests must be greater than 1" });
    }

    const newApartment = new Apartment({
      user: userId,
      name,
      description,
      apartmentType,
      price,
      numOfGuests,
      address,
    });

    await newApartment.save();
    res
      .status(201)
      .json({ message: "Apartment created successfully", newApartment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getAllApartments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const apartments = await Apartment.find({ user: userId });

    res.status(200).json({ apartments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.editApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const userId = req.user.userId;

    const { name, description, apartmentType, price, numOfGuests, address } =
      req.body;

    const existingApartment = await Apartment.findOne({
      _id: apartmentId,
      user: userId,
    });

    if (!existingApartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    existingApartment.name = name;
    existingApartment.description = description;
    existingApartment.apartmentType = apartmentType;
    existingApartment.price = price;
    existingApartment.numOfGuests = numOfGuests;
    existingApartment.address = address;

    await existingApartment.save();

    res.status(200).json({ message: "Apartment updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.deleteApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const userId = req.user.userId; // Assuming userId is available in req.user

    // Check if the apartment belongs to the user
    const apartment = await Apartment.findOne({
      _id: apartmentId,
      user: userId,
    });

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    // Delete the apartment
    await Apartment.deleteOne({ _id: apartmentId });

    res.status(200).json({ message: "Apartment deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
