var chai = require("chai");
var sinon = require('sinon');
var PriceService = require('../services/priceService');
var expect = chai.expect;

describe("PriceService", function () {
	var priceService; 
	var serviceClient = function(url, callback){ 
		return {currency:{value:1.34}};
	};

	beforeEach(function(){
		priceService = new PriceService({
			"priceServiceConfig": {
			"host": "http://localhost:10"
		}}, serviceClient);
	});

	it("should calculate given price and call callback method", function (done) {
		var callbackFunc = sinon.spy();
		priceService.calculate({
			currency: 'TL',
			originalAmount: 15.0,
			discountAmount: 10.0,
			discountStart: '2014-10-10T14:17:18',
			discountEnd: '2014-10-15T14:17:18',
			taxRate: 18,
			extraFeeOriginalAmount: 20.0,
			extraFeeDiscountAmount: 15.0,
			extraFeeDiscountStart: '2014-10-10T14:17:18',
			extraFeeDiscountEnd: '2014-10-10T14:17:18'
		}, callbackFunc);

		done();

		expect(callbackFunc.called);
	});

	it("should calculate given price", function (done) {
		var callbackFunc = sinon.spy();
		priceService.calculate({
			currency: 'TL',
			originalAmount: 15.0,
			discountAmount: 10.0,
			discountStart: '2014-10-10T14:17:18',
			discountEnd: '2014-10-15T14:17:18',
			taxRate: 18,
			extraFeeOriginalAmount: 20.0,
			extraFeeDiscountAmount: 15.0,
			extraFeeDiscountStart: '2014-10-10T14:17:18',
			extraFeeDiscountEnd: '2014-10-10T14:17:18'
		}, callbackFunc);

		done();

		expect(callbackFunc.calledWith({
			"originalPrice":{
				"amount":41.3,
				"symbol":"TL",
				"taxIncluded":true
			},
			"discountPrice":{
				"amount":0,
				"symbol":"TL",
				"taxIncluded":true
			},
			"discountRate":0
		}));
	});

	it("should calculate given none TL price", function (done) {
		var callbackFunc = sinon.spy();
		priceService.calculate({
			currency: 'USD',
			originalAmount: 15.0,
			discountAmount: 10.0,
			discountStart: '2014-10-10T14:17:18',
			discountEnd: '2014-10-15T14:17:18',
			taxRate: 18,
			extraFeeOriginalAmount: 20.0,
			extraFeeDiscountAmount: 15.0,
			extraFeeDiscountStart: '2014-10-10T14:17:18',
			extraFeeDiscountEnd: '2014-10-10T14:17:18'
		}, callbackFunc);

		done();

		expect(callbackFunc.calledWith({
			"originalPrice":{
				"amount":41.3,
				"symbol":"TL",
				"taxIncluded":true
			},
			"discountPrice":{
				"amount":0,
				"symbol":"TL",
				"taxIncluded":true
			},
			"discountRate":0
		}));
	});
});