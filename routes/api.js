const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
	res.status(404);
});

router.get('/test', (req, res) => {
	res.json({ message: '/api/test' });
});

router.get('/reviews', async (req, res) => {
	const collection = db.collection('listingsAndReviews');
	const limit = 10;
	const skip = 0;

	try {
		const reviews = await collection.find({}).skip(skip).limit(limit).toArray();
		res.json(reviews);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
})

module.exports = router;