var   express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , winston = require('winston')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , config = require('config');

var routes = require('./routes/index');
var price = require('./routes/price');

var serviceConfig = config.get('priceServiceConfig.host');
winston.info(serviceConfig);

var app = express();

winston.add(winston.transports.File, { filename: './log/service.log' });
exports.logger = winston;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/price', price);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var ex = {
      message: err.message,
      error: err
    };
    winston.error(ex);
    res.render('error', ex);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var ex = {
    message: err.message,
    error: err
  };
  winston.error(ex);
  res.render('error', ex);
});


module.exports = app;
