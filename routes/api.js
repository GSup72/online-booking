const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
	res.status(404);
});
router.get('/test', (req, res) => {
	res.json({ message: '/api/test' });
});
module.exports = router;