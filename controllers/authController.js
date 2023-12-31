require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET = process.env.JWT_SECRET;


module.exports.signup_get = (req, res) => {
	res.render('signup');
}

module.exports.signin_get = (req, res) => {
	res.render('signin');
}


module.exports.signup_post = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name) {
			return res.status(400).json({ error: 'Name cannot be empty' });
		};

		if (!email) {
			return res.status(400).json({ error: 'Email cannot be empty' });
		};

		if (!email.includes('@')) {
			return res.status(400).json({ error: 'Invalid email format' });
		}

		if (/\s/.test(email)) {
			return res.status(400).json({ error: 'Email cannot contain spaces' });
		}

		if (password.length < 6 || password.length > 25) {
			return res.status(400).json({ error: 'Password should be between 6 and 25 characters long' });
		};

		const existingUser = await User.findOne({ $or: [{ name }, { email }] });
		if (existingUser) {
			return res.status(400).json({ error: 'User with the same name or email already exists' });
		};

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '1h' });

		res.cookie('jwt', token);
		res.status(200).json({ token });
		// res.status(201).json({ message: 'User has been created successfully' });
	} catch (err) {
		console.error('Signup error:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports.signin_post = async (req, res) => {
	try {
		const { name, password } = req.body;

		if (!name) {
			return res.status(400).json({ error: 'Name cannot be empty' });
		}

		if (password.length < 6 || password.length > 25) {
			return res.status(400).json({ error: 'Password should be between 6 and 25 characters long' });
		}

		const user = await User.findOne({ name });

		if (!user) {
			return res.status(401).json({ error: 'Wrong name or password' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: 'Wrong name or password' });
		}

		const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

		res.cookie('jwt', token);
		res.status(200).json({ token });
	} catch (err) {
		console.error('Auth error:', err);
		res.status(500).json({ error: 'Server error' });
	}
};
