const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();
const db = require('../db');

const SECRET = process.env.JWT_SECRET;


function verifyToken(req, res, next) {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ error: 'Authorization token is missing' });
	}

	jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
		console.log('Decoded token:', decoded);
		if (err) {
			return res.status(401).json({ error: 'Invalid token' });
		}

		req.decodedToken = decoded;

		next();
	});
}

router.get('/reviews', async (req, res) => {
	const collection = db.collection('listingsAndReviews');
	const limit = 10;
	const skip = 0;

	try {
		const reviews = await collection.find({}).skip(skip).limit(limit).toArray();
		res.json(reviews);
	} catch (error) {
		console.error("Error while trying to get reviews:", err);
		res.status(500).json({ error: "Server error" });
	}
})

router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ $or: [{ name }, { email }] });
		if (existingUser) {
			return res.status(400).json({ error: 'User with the same name or email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(201).json({ message: 'User has been created successfully' });
	} catch (err) {
		console.error('Signup error:', err);
		res.status(500).json({ error: 'Server error' });
	}
});

router.post('/signin', async (req, res) => {
	try {
		const { name, password } = req.body;

		const user = await User.findOne({ name });

		if (!user) {
			return res.status(401).json({ error: 'Wrong name or password' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: 'Wrong name or password' });
		}

		const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

		res.status(200).json({ token });
	} catch (err) {
		console.error('Auth error:', err);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;