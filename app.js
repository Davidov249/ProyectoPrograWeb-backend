var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const { verifyJwt } = require("./routes/auth");
//const { redisMiddleware } = require("./routes/redis");
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var musicRouter = require('./routes/music');

var app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Music API",
      version: "1.0.0",
      description: "Music API",
      contact: {
        name: "Jose",
      },
      servers: ["http://localhost:1024"],
    },
  },
  apis: ["./routes/*js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/apidocumentation", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/music', verifyJwt,musicRouter);
app.get("/healthcheck", (req, res, next) => {
  res.status(200).send();
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
