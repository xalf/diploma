var mongoose = require('mongoose'); 

var tableSchema = new mongoose.Schema({
	number: {type: Number, require: true},
	numberOfSeats: {},
	cafeid: {type: String, require: true},
	width: Number,
	height: Number,
	x: Number,
	y: Number,
	type: {type: String, require: true}
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