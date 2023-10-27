const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: 'sample_airbnb', // Поміняти на назву своєї бази

});

const db = mongoose.connection;

db.on('error', (err) => {
	console.error('MongoDB connection error:', err);
});

db.once('open', () => {
	console.log('Connected to MongoDB');
});

module.exports = db;