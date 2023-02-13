var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const Rooms = require('./models/Room-model')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lairRouter = require('./routes/lairs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 600000 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI 

      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lairs', lairRouter);

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


const testLairs = [
  {
      name: 'Frankensteins Lab',
      description: 'Looks pretty cozy to me',
      imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/003/483/485/medium/vlad-dorfman-frankenlabfinal.jpg?1474208189',
      owner: '63e97eb439585f341f83b907',
      test: "yes"
  },
  {
      name: 'Draculas Castle',
      description: 'Spooky',
      imageUrl: 'https://media.vanityfair.com/photos/59f8b2ca5b4bf556949d8d0b/2:3/w_894,h_1341,c_limit/Bran-Castle-bw.jpg',
      owner: '63e97eb439585f341f83b907',
      test: "yes",
      
  }, 
  {
    name: 'Frankensteins Lab',
    description: 'Looks pretty cozy to me',
    imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/003/483/485/medium/vlad-dorfman-frankenlabfinal.jpg?1474208189',
    owner: '63e97eb439585f341f83b907',
    test: "yes"
},
{
    name: 'Draculas Castle',
    description: 'Spooky',
    imageUrl: 'https://media.vanityfair.com/photos/59f8b2ca5b4bf556949d8d0b/2:3/w_894,h_1341,c_limit/Bran-Castle-bw.jpg',
    owner: '63e97eb439585f341f83b907',
    test: "yes",
    
}, 
{
  name: 'Frankensteins Lab',
  description: 'Looks pretty cozy to me',
  imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/003/483/485/medium/vlad-dorfman-frankenlabfinal.jpg?1474208189',
  owner: '63e97eb439585f341f83b907',
  test: "yes"
},
{
  name: 'Draculas Castle',
  description: 'Spooky',
  imageUrl: 'https://media.vanityfair.com/photos/59f8b2ca5b4bf556949d8d0b/2:3/w_894,h_1341,c_limit/Bran-Castle-bw.jpg',
  owner: '63e97eb439585f341f83b907',
  test: "yes",
  
}, {
  name: 'Frankensteins Lab',
  description: 'Looks pretty cozy to me',
  imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/003/483/485/medium/vlad-dorfman-frankenlabfinal.jpg?1474208189',
  owner: '63e97eb439585f341f83b907',
  test: "yes"
},
{
  name: 'Draculas Castle',
  description: 'Spooky',
  imageUrl: 'https://media.vanityfair.com/photos/59f8b2ca5b4bf556949d8d0b/2:3/w_894,h_1341,c_limit/Bran-Castle-bw.jpg',
  owner: '63e97eb439585f341f83b907',
  test: "yes",
  
}, 
  
   ];

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  }).then(() =>{ 
    
    const deleteDb = () => {
       Rooms.deleteMany(testLairs);
      }
     deleteDb();
  }) 
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  const deleteDb = async () => {
    await Rooms.deleteMany({});
  };
  
  const seedDB = async () => {
    await Rooms.insertMany(testLairs);
  };

  (async () => {
    await deleteDb();
    await seedDB();
  })();

    module.exports = app;
