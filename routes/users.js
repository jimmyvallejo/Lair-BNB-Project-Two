var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

const User = require('../models/User.model')

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup.hbs');
});

router.post('/signup', (req, res, next) =>{
  const { userName, email, password, imageUrl} = req.body;

  if (!userName || !email || !password) {
    res.render('users/signup.hbs', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
 
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt)
    })
    .then((hashedPassword) => {
      return User.create({
        userName,
        email,
        password: hashedPassword,
        imageUrl
      });
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/users/login')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('users/signup.hbs', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('users/signup.hbs', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })

})

router.get('/login', (req, res, next) =>{
  res.render('users/login.hbs');
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    res.render('users/login.hbs', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('users/login.hbs', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user
        console.log(user);
        res.redirect('/');
      } else {
        res.render('users/login.hbs', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});





router.get('/profile', isLoggedIn ,(req, res, next) => {
  User.findById(req.session.user._id)
  .then((foundUser) => {
    res.render('users/profile.hbs', foundUser)
  })
  .catch((err) => {
      console.log(err)
  })
})

router.get('/profile/edit', isLoggedIn ,(req, res, next) => {
  User.findById(req.session.user._id)
  .then((foundUser) => {
    res.render('users/profile-edit.hbs', foundUser)
  })
  .catch((err) => {
      console.log(err)
  })
})

router.post('/profile/edit', (req, res, next) => {
  const { userName, email, imageUrl, password } = req.body;

  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.findByIdAndUpdate(req.session.user._id, {
        userName, 
        imageUrl,
        email,
        password: hashedPassword
      }, { new: true });
    })
    .then((updatedUser) => {
      console.log(updatedUser)
      res.redirect(`/users/profile/`)
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});




module.exports = router;
