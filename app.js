var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const Rooms = require('./models/Room-model')

const testLairss = require("./Seed/testLairs");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lairRouter = require('./routes/lairs');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.set('trust-proxy', 1);
app.enable('trust proxy');

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
      maxAge: 6000000 // 60 * 1000 ms === 1 min
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
      price: 299,
      owner: '63eec474d40b739c564b42a8',
      test: "yes"
  },
  {
      name: 'Draculas Castle',
      description: 'Spooky',
      imageUrl: 'https://media.vanityfair.com/photos/59f8b2ca5b4bf556949d8d0b/2:3/w_894,h_1341,c_limit/Bran-Castle-bw.jpg',
      price: 299,
      owner: '63eec474d40b739c564b42a8',
      test: "yes",
      
  }, 
  {
    name: `Gru's Lab`,
    description: 'Perfect for any Supervillian',
    imageUrl: 'http://res.cloudinary.com/ybmedia/image/upload/c_crop,h_1078,w_1920,x_0,y_3/c_fill,f_auto,h_1215,q_auto,w_2160/v1/m/f/8/f8e6d0d0945fd2ac3037d1486f438ff6926541bc/20-facts-might-know-despicable.jpg',
    price: 1000,
    owner: '63eec474d40b739c564b42a8',
    test: "yes"
},
{
    name: 'Alien Abduction',
    description: 'Am i dreaming?',
    imageUrl: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/01/30/16/alien-abduction-1.jpg?quality=75&width=1200&auto=webp',
    price: 700,
    owner: '63eec474d40b739c564b42a8',
    test: "yes",
    
}, 
{
  name: 'Cabin in the Woods',
  description: 'Looks pretty cozy to me',
  imageUrl: 'https://cabinlane.com/wp-content/uploads/2021/05/ten-mile-cabin.jpg',
  price: 170,
  owner: '63eec474d40b739c564b42a8',
  test: "yes"
},
{
  name: 'Abandoned Asylum',
  description: 'Who would want to spend the night here',
  imageUrl: 'https://magazine.columbia.edu/sites/default/files/styles/wysiwyg_full_width_image/public/2019-07/Photo-of-Buffalo-State-Hospital-by-Christopher-Payne.jpg?itok=rZ9xioBC',
  price: 199,
  owner: '63eec474d40b739c564b42a8',
  test: "yes",
  
}, {
  name: 'Under the bed',
  description: 'Every kids worse nightmare',
  imageUrl: 'https://cdn.hswstatic.com/gif/now-MgIyOpQe-Bedcroppedjpg-1210-680.jpg',
  price: 10,
  owner: '63eec474d40b739c564b42a8',
  test: "yes"
},
{
  name: 'Conjuring House',
  description: 'I dont wanna be here',
  imageUrl: 'https://www.gannett-cdn.com/presto/2022/04/29/NSTN/0f7febb7-6625-44a4-97f3-649fd28684fd-NCWIL-041522-FEA-HOUSE2.JPG',
  price: 500,
  owner: '63eec474d40b739c564b42a8',
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
    await Rooms.deleteMany({test:"yes"});
  };
  
  const seedDB = async () => {
    await Rooms.insertMany(testLairs);
  };

  (async () => {
    await deleteDb();
    await seedDB();
  })();

    module.exports = app;
