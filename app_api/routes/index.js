var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});
var cafeCtrl = require('../controllers/cafe');
var reviewsCtrl = require('../controllers/reviews');
var authCtrl = require('../controllers/authentication');

router.get('/cafe', cafeCtrl.cafesByFilter);
router.post('/cafe', cafeCtrl.cafesCreate);
router.get('/cafe/:cafeid', cafeCtrl.cafeInfo);
router.delete('/cafe/:cafeid', cafeCtrl.cafeDelete);
router.put('/cafe/:cafeid', cafeCtrl.cafeUpdate);

router.get('/cafe/:cafeid/reviews/:reviewid', reviewsCtrl.reviewsReadOne);
router.post('/cafe/:cafeid/reviews', auth, reviewsCtrl.reviewCreate);
router.put('/cafe/:cafeid/reviews/:reviewid', auth, reviewsCtrl.reviewUpdate);
router.delete('/cafe/:cafeid/reviews/:reviewid', auth, reviewsCtrl.reviewDelete);

router.post('/user/register', authCtrl.register);
router.post('/user/login', authCtrl.login);
router.get('/user', auth, authCtrl.userInfo);
router.delete('/user', auth, authCtrl.deleteUser);
router.post('/user/image', auth, authCtrl.updateUser);

module.exports = router;