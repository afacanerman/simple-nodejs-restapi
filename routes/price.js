var express = require('express');
var winston = require('winston');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	winston.log('info', 'Hello distributed log files!');
	
  	res.send('respond with a resource');
});

module.exports = router;
