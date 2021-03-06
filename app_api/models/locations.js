var mongoose = require('mongoose');

var timeSchema = new mongoose.Schema({
	number: {type: Number, min: 0, max: 6, require: true},
	name: {type: String, require: true},
	isChoice: {type: Boolean, "default": false},
	openTime: Date,
	closeTime: Date
});

var contactSchema = new mongoose.Schema({
	name: {type: String, require: true},
	value: {type: String, required: true},
	isLink: {type: Boolean, "default": false}
});

var reviewsSchema = new mongoose.Schema({
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: {type: String, required: true},
	createOn:{type: Date, "default": Date.now()}
});

var cafeSchema = new mongoose.Schema({
	name: {type: String, required: true},
	address: String,
	cuisine: String,
	payments: [String],
	timetable: {type: [timeSchema], required: true},
	contacts: {type: [contactSchema], required: true},
	reviews: [reviewsSchema],
	rating: {type: Number, "default": 0, min: 0, max: 5},
	create: {type: Date, "default": Date.now()},
	order: {type: Number, "default": 0, min: 0},
	check: {type: Number, required: true},
	img: String,
	workTableImg: String
});

mongoose.model('Cafe', cafeSchema, 'cafes');
