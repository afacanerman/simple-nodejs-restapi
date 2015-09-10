var winston = require('winston');
var moment = require('moment');

var PriceService = function(config, restClient) {
    
    var applyTax = function(value, taxRate){
        var multiplier = (taxRate/100) + 1;
        return value * multiplier;
    };

    var calculatePrice = function(priceModel){
        var discountPrice = 0;
        var now = moment();

        var isPriceDiscounted = priceModel.discountStart < now 
                                && priceModel.discountEnd > now;
        var isExtraFreeDiscounted = priceModel.extraFeeDiscountStart < now 
                                    && priceModel.extraFeeDiscountEnd > now;

        if (isPriceDiscounted || isExtraFreeDiscounted) {
            if (isPriceDiscounted) {
                discountPrice += applyTax(priceModel.discountAmount, priceModel.taxRate);
            } else {
                discountPrice += applyTax(priceModel.originalAmount, priceModel.taxRate);
            }

            if (isExtraFreeDiscounted) {
                discountPrice += applyTax(priceModel.extraFeeDiscountAmount, 18);
            } else {
                discountPrice += applyTax(priceModel.extraFeeOriginalAmount, 18);
            }
        }

        var originalPrice = applyTax(priceModel.originalAmount, priceModel.taxRate) + applyTax(priceModel.extraFeeOriginalAmount, 18);
        var discountRate = discountPrice == 0 
                            ? 0 
                            : Convert.ToInt32(Math.Round((originalPrice - discountPrice) * 100 / originalPrice, 0));

        return {
            'originalPrice': {
                'amount': originalPrice,
                'symbol': priceModel.currency,
                'taxIncluded': true
            },
            'discountPrice' : {
                'amount': discountPrice,
                'symbol': priceModel.currency,
                'taxIncluded': true
            },
            'discountRate': discountRate
        };
    };

    var calculate = function(priceModel, callback) {

        if (priceModel.currency !== "TL") {
            var serviceUri = config.get('priceServiceConfig.host')+'/currencies/symbol/' + priceModel.currency;

            restClient(serviceUri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    
                    priceModel.originalAmount *= body.value;
                    priceModel.discountAmount *= body.value;

                    var priceResult = calculatePrice(priceModel);

                    if(typeof(callback) === "function"){
                        callback(priceResult);
                    }
                    
                }
            });
        }

        
        var priceResult = calculatePrice(priceModel);

        if(typeof(callback) === "function"){
            callback(priceResult);
        }  
    };


    return {
        calculate: calculate
    };
}

module.exports = PriceService;