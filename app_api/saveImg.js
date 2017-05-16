var multiparty = require('multiparty');
var fs = require("fs");

module.exports = function(req, callback){
	var form = new multiparty.Form();
	var uploadFile = {path: './public/upload/', type: '', size: 0};
	//максимальный размер файла
	var maxSize = 2 * 1024 * 1024; //2MB
	//поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
	var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
	//массив с ошибками произошедшими в ходе загрузки файла
	var errors = [];

	 //если произошла ошибка
	form.on('error', function(err){
		if(fs.existsSync(uploadFile.path)) {
			//если загружаемый файл существует удаляем его
			fs.unlinkSync(uploadFile.path);
			console.log('error');
		}
	});

	form.on('close', function() {
		//если нет ошибок и все хорошо
		if(errors.length == 0) {
			callback(uploadFile);
		}
		else {
			if(fs.existsSync(uploadFile.path)) {
				//если загружаемый файл существует удаляем его
				fs.unlinkSync(uploadFile.path);
			}
			//сообщаем что все плохо и какие произошли ошибки
			sendJsonResponse(res, 404, errors);
		}
	});

	// при поступление файла
	form.on('part', function(part) {
		//читаем его размер в байтах
		uploadFile.size = part.byteCount;
		//читаем его тип
		uploadFile.type = part.headers['content-type'];
		//путь для сохранения файла
		uploadFile.path += part.filename;

		//проверяем размер файла, он не должен быть больше максимального размера
		if(uploadFile.size > maxSize) {
			errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
		}

		//проверяем является ли тип поддерживаемым
		if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
			errors.push('Unsupported mimetype ' + uploadFile.type);
		}

		//если нет ошибок то создаем поток для записи файла
		if(errors.length == 0) {
			var out = fs.createWriteStream(uploadFile.path);
			part.pipe(out);
		}
		else {
			//пропускаем
			//вообще здесь нужно как-то остановить загрузку и перейти к onclose
			part.resume();
		}
	});

	// парсим форму
	form.parse(req);
};
var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}