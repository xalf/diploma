var mongoose = require('mongoose'); 

var tableSchema = new mongoose.Schema({
	number: {type: Number, require: true},
	numberOfSeats: {},
	cafeid: {type: String, require: true},
	size: Number,
	color: String,
	x: Number,
	y: Number
});

var orderSchema = new mongoose.Schema({
	cafeid: {type: String, require: true},
	dateEnd: {type: Date, require: true},
	date: {type: Date, require: true},
	clientid: {type: String, require: true},
	tableNumber: {type: Number, require: true}
});

mongoose.model('Order', orderSchema, 'orders');
mongoose.model('Table', tableSchema, 'tables');