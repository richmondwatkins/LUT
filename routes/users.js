var express = require('express');
var router = express.Router();
var UsersController = require('../controllers/UsersController.js');

router.delete('/delete', function(req, res, next) {
    new UsersController(req, res).destroy();
});

module.exports = router;
