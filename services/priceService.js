var request = require('request');

var PriceService = function(config){
	var config = config || {};
	
	var calculate = function(priceModel, callback){

		// make some calculation

		if(typeof(callback) === "function"){
			callback();			
		}
	}

	return {
		calculate: calculate
	};
	
}

module.exports = PriceService;