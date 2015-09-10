var express = require('express');
var url = require('url');
var client = require('request');
var winston = require('winston');
var config = require('config');
var PriceService = require('../services/priceService');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var priceService = new PriceService(config, client);
	priceService.calculate(query, function(response){
  		res.send(response);
	});
});

module.exports = router;
