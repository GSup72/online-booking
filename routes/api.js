const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController')
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware');


router.get('/reviews', verifyToken, listingsController.reviews_get);
router.post('/signin', authController.signin_post);
router.get('/signin', authController.signin_get);
router.post('/signup', authController.signup_post);
router.get('/signup', authController.signup_get);



module.exports = router;