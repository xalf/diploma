var express = require('express');
var router = express.Router();
var mainCtrl = require('../controllers/main');

/* GET home page. */
router.get('/', mainCtrl.angularApp);
//router.get('/admin', mainCtrl.admin);
//router.get('/cafe/:cafeid', mainCtrl.cafe);
//router.get('/cafe/:cafeid/review/add', mainCtrl.addReview);
//router.post('/cafe/:cafeid/review/add', mainCtrl.doAddReview);

module.exports = router;
