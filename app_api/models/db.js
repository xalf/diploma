var mongoose = require('mongoose');
var readline = require('readline');
require('./locations');
require('./users');
require('./orders');

var dbURL = 'mongodb://127.0.0.1/diploma';
mongoose.connect(dbURL);

if(process.platform === "win32"){
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.on("SIGINT", function(){
		process.emit("SIGINT");
	});
}

mongoose.connection.on('connected', function(){
	console.log('mongoose connected to ' + dbURL);
});
mongoose.connection.on('error', function(err){
	console.log('mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('mongoose disconnected to ' + dbURL);
});

gracefulShutdown = function(msg,callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

//Для перезапуска nodemon
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
//Для завершения приложения
process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});
//Для завершения приложения Heroku
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});