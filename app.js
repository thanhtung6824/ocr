const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// require('./models');
const expressValidator = require('express-validator');
const hbs = require('express-handlebars');
const configRoutes = require('./configs/configRoutes');

const indexRouter = require('./routes/index');
const viewRouter = require('./routes/views');

const app = express();


app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    partialsDir: __dirname + '/views/partials', //eslint-disable-line
    layoutsDir: __dirname + '/views/layouts/', //eslint-disable-line
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', configRoutes.checkApiKey, indexRouter);
app.use('/views', viewRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
process.on('uncaughtException', function (err) {
    console.log(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
