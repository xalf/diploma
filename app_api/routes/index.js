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
var orderCtrl = require('../controllers/order');

router.get('/cafe', cafeCtrl.cafesByFilter);
router.get('/cafe/:cafeid', cafeCtrl.cafeInfo);
router.get('/cafe/:cafeid/workTable', cafeCtrl.workTableInfo);
router.get('/cafe/:cafeid/orders', cafeCtrl.getOrders);
router.post('/cafe/:cafeid/table', auth, cafeCtrl.updateTable);
router.post('/cafe/:cafeid/worktableimg', auth, cafeCtrl.cafeUpdateWorkTableImg);
router.post('/cafe', auth, cafeCtrl.cafesCreate);
router.post('/cafe/:cafeid/image', auth, cafeCtrl.cafeUpdateImg);
router.delete('/cafe/:cafeid', auth, cafeCtrl.cafeDelete);
router.put('/cafe/:cafeid', auth, cafeCtrl.cafeUpdate);

router.get('/cafe/:cafeid/reviews/:reviewid', reviewsCtrl.reviewsReadOne);//-
router.post('/cafe/:cafeid/reviews', auth, reviewsCtrl.reviewCreate);
router.put('/cafe/:cafeid/reviews/:reviewid', auth, reviewsCtrl.reviewUpdate);
router.delete('/cafe/:cafeid/reviews/:reviewid', auth, reviewsCtrl.reviewDelete);

router.post('/user/register', authCtrl.register);
router.post('/user/login', authCtrl.login);
router.get('/user/client', auth, authCtrl.clientInfo);
router.get('/user/admin', auth, authCtrl.adminInfo);
router.delete('/user', auth, authCtrl.deleteUser);
router.post('/user/client/image', auth, authCtrl.updateClient);

router.get('/user/admin/:cafeid', auth, orderCtrl.getOrdersByCafeId);
router.get('/user/client/:clientid', auth, orderCtrl.getOrdersByClientId);
router.post('/user/client/order', auth, orderCtrl.addOrder);
router.delete('/user/client/order/:orderid', auth, orderCtrl.deleteOrder);

module.exports = router;